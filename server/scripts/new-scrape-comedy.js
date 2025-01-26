const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function scrapeNYCComedyEvents() {
  const city = "New York";
  const state = "NY";
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

      Array.from(eventElements).forEach((row) => {
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
            const eventDetails = {
              email: "",
              phone: "",
              frequency: "",
              cost: "",
              info: "",
              link: "",
            };

            Array.from(detailCells).forEach((cell) => {
              const header = cell?.textContent?.split(": ")[0]?.trim();

              const valueCell = cell.cloneNode(true);
              const skipNodes = valueCell.querySelectorAll(".google-anno-skip");
              skipNodes.forEach((node) => node.remove());

              const value = valueCell?.textContent
                ?.split(": ")[1]
                ?.trim()
                .replace(/\s+/g, " ");

              switch (header) {
                case "Event Name":
                  console.log("Event Name", value);
                  eventDetails.name = value;
                  break;
                case "Venue Name":
                  eventDetails.venue = value;
                  break;
                case "Address":
                  eventDetails.address = value;
                  break;
                case "Phone":
                  eventDetails.phone = value;
                  break;
                case "Frequency":
                  eventDetails.frequency = value;
                  break;
                case "Day":
                  eventDetails.day = value;
                  break;
                case "Time":
                  eventDetails.time = value;
                  break;
                case "Website":
                  eventDetails.link = cell.querySelector("a")?.href;
                  break;
                case "Email":
                  eventDetails.email = value;
                  break;
                case "Cost":
                  eventDetails.cost = value;
                  break;
                case "Info":
                  eventDetails.info = value;
                  break;
              }
            });

            let eventType = "singular";
            if (
              eventDetails.frequency === "Weekly" ||
              eventDetails.frequency === "Bi-Weekly" ||
              eventDetails.frequency === "Monthly"
            ) {
              eventType = "recurring";
            }

            const date = new Date(currentDate);
            const getRecurrenceRule = (date, frequency) => {
              if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
              }

              const dayOfWeek = date.getDay();
              const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
              let recurrence_rule = "";

              if (frequency === "Weekly") {
                recurrence_rule = `FREQ=WEEKLY;BYDAY=${days[dayOfWeek]}`;
              } else if (frequency === "Bi-Weekly") {
                recurrence_rule = `FREQ=WEEKLY;INTERVAL=2;BYDAY=${days[dayOfWeek]}`;
              } else if (frequency === "Monthly") {
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
            const recurrence_rule = getRecurrenceRule(
              date,
              eventDetails.frequency
            );

            const city = "New York";
            const state = "NY";

            return {
              event_type: eventType,
              recurrence_rule,
              state,
              city,
              ...eventDetails,
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
          console.log("Breaking loop");
          break;
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
    const outputPath = path.join(dataDir, `${state}-comedy-events.json`);
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

scrapeNYCComedyEvents().catch(console.error);
