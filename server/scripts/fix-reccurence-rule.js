const fs = require("fs");
const path = require("path");

function getRecurrenceRule(date, frequency) {
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
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const weekNum = Math.ceil(date.getDate() / 7);
    const isLastOccurrence = date.getDate() + 7 > lastDay.getDate();
    const bysetpos = isLastOccurrence ? -1 : weekNum;
    recurrence_rule = `FREQ=MONTHLY;BYDAY=${days[dayOfWeek]};BYSETPOS=${bysetpos}`;
  }

  return recurrence_rule;
}

async function fixRecurrenceRules() {
  try {
    const dataDir = path.join(__dirname, "data");
    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"));

    for (const file of files) {
      console.log(`Processing ${file}...`);
      const filePath = path.join(dataDir, file);
      const events = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      let updatedCount = 0;

      const updatedEvents = events.map((event) => {
        if (event.frequency && event.date) {
          const date = new Date(event.date);
          const newRule = getRecurrenceRule(date, event.frequency);
          if (newRule !== event.recurrence_rule) {
            updatedCount++;
            return {
              ...event,
              recurrence_rule: newRule,
            };
          }
        }
        return event;
      });

      fs.writeFileSync(filePath, JSON.stringify(updatedEvents, null, 2));
      console.log(`Updated ${updatedCount} recurrence rules in ${file}`);
    }
  } catch (error) {
    console.error("Error fixing recurrence rules:", error);
  }
}

fixRecurrenceRules();
