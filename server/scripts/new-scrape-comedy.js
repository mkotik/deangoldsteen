const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function scrapeNYCComedyEvents() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto("https://badslava.com/new-york-open-mics.php");

    const events = await page.evaluate(() => {
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
        } else {
          const newEvent = {
            date: currentDate,
          };
          output.push(newEvent);
        }

        // if (cells.length == 2) {
        //   const time = cells[0].textContent;
        //   events.push({
        //     date: currentDate,
        //     time,
        //     venue: cells[1].textContent,
        //   });
        // }

        // console.log(event);
        // const dayTime =
        //   event.querySelector(".day-time")?.textContent?.trim() || "";
        // const venue = event.querySelector(".venue")?.textContent?.trim() || "";
        // const address =
        //   event.querySelector(".address")?.textContent?.trim() || "";
        // const signupInfo =
        //   event.querySelector(".signup-info")?.textContent?.trim() || "";
        // const cost = event.querySelector(".cost")?.textContent?.trim() || "";
        // const notes = event.querySelector(".notes")?.textContent?.trim() || "";
        // // Parse day and time
        // const [day, time] = dayTime.split(" @ ");
        // return {
        //   day,
        //   time,
        //   venue,
        //   address,
        //   signupInfo,
        //   cost,
        //   notes,
        //   state: "NY",
        // };
      });
      return output;
    });

    console.log("events", events);

    // Save to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(
      __dirname,
      `/data/nyc-comedy-events-${timestamp}.json`
    );
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));

    // console.log(`Scraped ${events.length} events to ${outputPath}`);
  } catch (error) {
    console.error("Error:", error);
  }

  // finally {
  //   await browser.close();
  // }
}

scrapeNYCComedyEvents().catch(console.error);
