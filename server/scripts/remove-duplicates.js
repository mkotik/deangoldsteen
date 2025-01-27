const fs = require("fs");
const path = require("path");

function removeDuplicates() {
  try {
    const filePath = path.join(__dirname, "data", "FL-comedy-events.json");

    // Read the file
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`Original records: ${data.length}`);

    // Create a Map to store unique events
    // Using venue + date + time as unique identifier
    const uniqueEvents = new Map();

    data.forEach((event) => {
      const key = `${event.venue}-${event.date}-${event.time}`;
      // Keep the record with more fields if there's a duplicate
      if (
        !uniqueEvents.has(key) ||
        Object.keys(event).length > Object.keys(uniqueEvents.get(key)).length
      ) {
        uniqueEvents.set(key, event);
      }
    });

    // Convert Map back to array
    const deduplicatedData = Array.from(uniqueEvents.values());

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(deduplicatedData, null, 2));

    console.log(
      `Records after removing duplicates: ${deduplicatedData.length}`
    );
    console.log(
      `Removed ${data.length - deduplicatedData.length} duplicate records`
    );
  } catch (error) {
    console.error("Error removing duplicates:", error);
  }
}

removeDuplicates();
