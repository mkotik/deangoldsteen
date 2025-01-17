const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function scrapeNYCComedyEvents() {
  const browser = await puppeteer.launch({
    headless: false,
    protocolTimeout: 30000, // Increase timeout to 30 seconds
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const events = [];

  try {
    await page.setDefaultNavigationTimeout(30000); // 30 second timeout for navigation
    await page.goto("https://badslava.com/new-york-open-mics.php", {
      waitUntil: "networkidle0", // Wait until network is idle
    });

    // Wait for the table to be visible
    await page.waitForSelector(".table-bordered tbody tr");

    const basicEvents = await page.evaluate(() => {
      const eventElements = document.querySelectorAll(
        ".table-bordered tbody tr"
      );
      let currentDate;
      const output = [];

      Array.from(eventElements)
        .slice(0, 3)
        .forEach((row) => {
          const cells = row.querySelectorAll("td");
          const headerCell = row.querySelector("th");

          // Check if this is a date row
          if (headerCell && cells.length < 2) {
            const dateText = headerCell.textContent?.trim() || "";

            if (!dateText) return;

            const [dayName, dateStr] = dateText.split(" ");
            const [month, day, year] = dateStr.split("/").map(Number);
            const fullYear = 2000 + year;

            currentDate = new Date(fullYear, month - 1, day).toISOString();

            // Extract city and state from address
          } else if (cells.length >= 2) {
            const newEvent = {
              date: currentDate,
              time: cells[0]?.textContent?.trim() || "",
              venue: cells[1]?.querySelector("b")?.textContent?.trim() || "",
              address:
                cells[1]?.textContent
                  ?.trim()
                  .replace(/([a-zA-Z])(\d)/, "$1 $2") || "",
              detailsUrl:
                cells[1]?.querySelector("a")?.getAttribute("href") || "",
            };
            output.push(newEvent);
          }
        });
      return output;
    });

    // Now fetch additional details for each event
    for (const event of basicEvents) {
      if (event.detailsUrl) {
        try {
          await page.goto(event.detailsUrl, {
            waitUntil: "networkidle0",
            timeout: 30000,
          });

          // Wait for content to load
          await page.waitForSelector("tbody tr", { timeout: 5000 });

          const details = await page.evaluate((currentDate) => {
            const detailCells = document.querySelectorAll("tbody tr");

            const name =
              detailCells[0]
                ?.querySelector("td")
                ?.textContent?.split("Event Name:")[1]
                ?.trim() || "";
            const phone =
              detailCells[3]
                ?.querySelector("td")
                ?.textContent?.split("Phone:")[1]
                ?.trim() || "";
            const frequencyCell =
              detailCells[4]
                ?.querySelector("td")
                ?.textContent?.split("Frequency:")[1]
                ?.trim() || "";

            let eventType = "singular";
            if (
              frequencyCell === "Weekly" ||
              frequencyCell === "Bi-Weekly" ||
              frequencyCell === "Monthly"
            ) {
              eventType = "recurring";
            }

            const date = new Date(currentDate);
            const getRecurrenceRule = (date, frequencyCell) => {
              if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
              }

              const dayOfWeek = date.getDay();
              const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
              let recurrence_rule = "";

              if (frequencyCell === "Weekly") {
                recurrence_rule = `FREQ=WEEKLY;BYDAY=${days[dayOfWeek]}`;
              } else if (frequencyCell === "Bi-Weekly") {
                recurrence_rule = `FREQ=WEEKLY;INTERVAL=2;BYDAY=${days[dayOfWeek]}`;
              } else if (frequencyCell === "Monthly") {
                const lastDay = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                );
                const weekNum = Math.ceil(date.getDate() / 7);
                const isLastOccurrence = date.getDate() + 7 > lastDay.getDate();
                const bysetpos = isLastOccurrence ? -1 : weekNum;
                recurrence_rule = `FREQ=MONTHLY;BYDAY=${days[dayOfWeek]};BYSETPOS=${bysetpos}`;
              }

              return recurrence_rule;
            };
            const recurrence_rule = getRecurrenceRule(date, frequencyCell);

            const city = "New York";
            const state = "NY";

            const cost =
              detailCells[7]
                ?.querySelector("td")
                ?.textContent?.split("Cost:")[1]
                ?.trim() || "";

            const info =
              detailCells[12]
                ?.querySelector("td")
                ?.textContent?.split("Info:")[1]
                ?.trim() || "";

            const link =
              detailCells[9]
                ?.querySelector("td")
                ?.textContent?.split("Website:")[1]
                ?.trim() || "";

            const email =
              detailCells[11]
                ?.querySelector("td")
                ?.textContent?.split("Email:")[1]
                ?.trim() || "";

            return {
              name,
              phone,
              eventType,
              frequency: frequencyCell,
              recurrence_rule,
              state,
              city,
              cost,
              info,
              link,
              email,
            };
          }, event.date);

          events.push({
            ...event,
            ...details,
          });

          // Go back to main page
          await page.goto("https://badslava.com/new-york-open-mics.php", {
            waitUntil: "networkidle0",
            timeout: 30000,
          });
        } catch (detailError) {
          console.error(
            `Error fetching details for event at ${event.venue}:`,
            detailError
          );
          // Still add the event without details
          events.push({
            ...event,
          });
        }
      }
    }

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(
      dataDir,
      `nyc-comedy-events-${timestamp}.json`
    );
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
  // finally {
  //   await browser.close();
  // }
}

scrapeNYCComedyEvents().catch(console.error);
