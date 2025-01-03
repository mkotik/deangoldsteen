import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { table } from "console";
import { ReceiptCent } from "lucide-react";

interface ScrapedEvent {
  time: string;
  name?: string;
  venue?: string;
  address: string;
  city: string;
  state: string;
  frequency?: string;
  cost?: string;
  info?: string;
  email?: string;
  link?: string;
  phone?: string;
  date: Date;
  event_type: string;
  recurrence_rule?: string;
  recurrence_end_date?: Date;
}

async function scrapeComedyEvents(state: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(
      `https://web.archive.org/web/20220327092905/http://badslava.com/open-mics-state.php?state=${state}&type=Comedy`
    );

    const events = await page.evaluate(() => {
      const tableElements = document.querySelectorAll("table");
      console.log(tableElements);
      // [table, table, table]
      // [[{}, {}, {}],[{}, {}, {}],[{}, {}, {}]]

      return Array.from(tableElements).map((table) => {
        let dateStr = "";
        console.log(table);
        let prevFontElement = table.previousElementSibling;
        while (prevFontElement && prevFontElement.tagName !== "FONT") {
          prevFontElement = prevFontElement.previousElementSibling;
        }
        if (prevFontElement) {
          const boldText =
            prevFontElement.querySelector("b")?.textContent?.trim() ||
            prevFontElement.textContent?.trim() ||
            "";
          const dateMatch = boldText.match(/\d{1,2}\/\d{1,2}\/\d{2}/);
          dateStr = dateMatch ? dateMatch[0] : "";
        }
        console.log(dateStr);
        const tbodyElements = table.querySelectorAll("tbody");
        return Array.from(tbodyElements).map((row) => {
          const cells = row.querySelectorAll("td");
          const timeCell = cells[0]?.textContent?.trim() || "";
          const nameCell = cells[1]?.textContent?.trim() || "";
          const venueCell = cells[2]?.textContent?.trim() || "";
          const addressCell = cells[3]?.textContent?.trim() || "";
          const cityCell = cells[4]?.textContent?.trim() || "";
          const stateCell = cells[5]?.textContent?.trim() || "";
          const frequencyCell = cells[7]?.textContent?.trim() || "";
          const costCell = cells[8]?.textContent?.trim() || "";

          const infoAnchor = cells[9]?.querySelector("a");
          const onclickAttr = infoAnchor?.getAttribute("onclick") || "";
          const alertMatch = onclickAttr.match(/alert\('(.+?)'\)/);
          const infoCell = alertMatch ? alertMatch[1] : "";

          const emailAnchor = cells[10]?.querySelector("a");
          const emailCell =
            emailAnchor?.getAttribute("href")?.split("=")[1] || "";

          const linkAnchor = cells[11]?.querySelector("a");
          const linkCell = linkAnchor?.getAttribute("href") || "";

          const phoneCell = cells[12]?.textContent?.trim() || "";

          // Extract address details
          const addressParts = addressCell
            .split(",")
            .map((part) => part.trim());
          const streetAddress = addressParts[0];
          let eventType = "singular";
          if (
            frequencyCell === "Weekly" ||
            frequencyCell === "Bi-Weekly" ||
            frequencyCell === "Monthly"
          ) {
            eventType = "recurring";
          }

          //   const date = new Date(dateStr);
          if (!dateStr) {
            throw new Error("Invalid date string");
          }
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
          }
          const dayOfWeek = date.getDay();
          const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
          let recurrence_rule = "";
          if (frequencyCell === "Weekly") {
            recurrence_rule = `FREQ=WEEKLY;BYDAY=${days[dayOfWeek]}`;
          } else if (frequencyCell === "Bi-Weekly") {
            recurrence_rule = `FREQ = WEEKLY;INTERVAL = 2;BYDAY = ${days[dayOfWeek]};`;
          } else if (frequencyCell === "Monthly") {
            // Get the last day of the month
            const lastDay = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            );

            // Get the week number (1-5) for this date
            const weekNum = Math.ceil(date.getDate() / 7);

            // Check if this is the last occurrence of this weekday in the month
            const isLastOccurrence = date.getDate() + 7 > lastDay.getDate();

            // Use -1 for last occurrence, otherwise use the week number
            const bysetpos = isLastOccurrence ? -1 : weekNum;
            // Get the week number (1-5) for this date

            recurrence_rule = `FREQ=MONTHLY;BYDAY=${days[dayOfWeek]};BYSETPOS=${bysetpos}`;
          } else {
            eventType = "singular";
            recurrence_rule = "N/A";
          }

          const [month, day, year] = dateStr.split("/").map(Number);

          const fullYear = 2000 + year;
          const dateObject = new Date(fullYear, month - 1, day);

          return {
            time: timeCell,
            name: nameCell || undefined,
            venue: venueCell || undefined,
            address: streetAddress,
            city: cityCell,
            state: stateCell,
            frequency: frequencyCell || undefined,
            cost: costCell || undefined,
            info: infoCell || undefined,
            email: emailCell || undefined,
            link: linkCell || undefined,
            phone: phoneCell || undefined,
            date: dateObject.toISOString(),
            event_type: eventType,
            recurrence_rule: recurrence_rule,
            recurrence_end_date: null,
            reviews: [],
          };
        });
      });
    });

    const flattenedEvents = events.flat();

    // // Filter out any invalid events (missing required fields)
    const validEvents = flattenedEvents.filter(
      (event) => event.time && event.address && event.city && event.state
    );

    // // Save to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(
      __dirname,
      `/data/comedy-events-${timestamp}.json`
    );
    fs.writeFileSync(outputPath, JSON.stringify(validEvents, null, 2));

    // console.log(`Scraped ${validEvents.length} events to ${outputPath}`);
    // console.log("Press any key to close the browser...");

    // // Wait for keypress
    // await new Promise((resolve) => process.stdin.once("data", resolve));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

const states = [
  // "CO",
  // "CT",
  // "DE",
  // "FL",
  // "GA",
  // "HI",
  // "ID",
  // "IL",
  // "IN",
  // "IA",
  // "KS",
  // "KY",
  // "LA",
  // "ME",
  // "MD",
  "MA",
  // "MI",
  // "MN",
  // "MS",
  // "MO",
  // "MT",
  // "NE",
  // "NV",
  // "NH",
  // "NM",
  // "NC",
  // "ND",
  // "OH",
  // "OK",
  // "OR",
  // "PA",
  // "RI",
  // "SC",
  // "SD",
  // "TN",
  // "UT",
  // "VT",
  // "VA",
  // "WA",
  // "WV",
  // "WI",
  // "WY",
];

async function scrapeAllStates() {
  for (const state of states) {
    console.log(`Scraping events for ${state}...`);
    await scrapeComedyEvents(state);
    // Add a delay between states to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

scrapeAllStates().catch(console.error);
