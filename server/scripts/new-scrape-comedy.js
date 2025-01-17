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
        .slice(0, 5)
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
          } else if (cells.length >= 2) {
            const eventDetailsUrl =
              cells[1]?.querySelector("a")?.getAttribute("href") || "";

            const newEvent = {
              date: currentDate,
              time: cells[0]?.textContent?.trim() || "",
              venue: cells[1]?.querySelector("b")?.textContent?.trim() || "",
              address: cells[1]?.textContent?.trim() || "",
              city: "New York",
              state: "NY",
              detailsUrl: eventDetailsUrl,
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

          const details = await page.evaluate(() => {
            const detailCells = document.querySelectorAll("tbody tr");
            return {
              info: Array.from(detailCells)
                .map((row) => row.textContent?.trim())
                .filter(Boolean)
                .join(" "),
            };
          });

          events.push({
            ...event,
            ...details,
            event_type: "singular",
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
            event_type: "singular",
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
  } finally {
    await browser.close();
  }
}

scrapeNYCComedyEvents().catch(console.error);
