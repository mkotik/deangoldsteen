const fs = require("fs");
const path = require("path");

function analyzeFrequencyData() {
  try {
    // Get the most recent file from the data directory
    const dataDir = path.join(__dirname, "data");
    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"))
      .sort((a, b) => {
        return (
          fs.statSync(path.join(dataDir, b)).mtime.getTime() -
          fs.statSync(path.join(dataDir, a)).mtime.getTime()
        );
      });

    if (files.length === 0) {
      console.log("No JSON files found in data directory");
      return;
    }

    const mostRecentFile = files[0];
    console.log(`Analyzing file: ${mostRecentFile}\n`);

    const data = JSON.parse(
      fs.readFileSync(path.join(dataDir, mostRecentFile), "utf-8")
    );

    const totalRecords = data.length;
    const recordsWithFrequency = data.filter(
      (record) => record.frequency
    ).length;
    const recordsWithoutFrequency = data.filter(
      (record) => !record.frequency
    ).length;

    console.log(`Total Records: ${totalRecords}`);
    console.log(`Records with frequency: ${recordsWithFrequency}`);
    console.log(`Records without frequency: ${recordsWithoutFrequency}`);
  } catch (error) {
    console.error("Error analyzing data:", error);
  }
}

analyzeFrequencyData();
