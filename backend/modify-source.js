import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import express from "express";
import multer from "multer";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = 5050;

const upload = multer({ dest: "uploads/" });

const sourceFilePath = path.join(__dirname, "../src/pages/U15.tsx");

const processExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  const extractedData = {};

  sheetNames.forEach((sheetName) => {
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1, // Array of arrays for better control
      defval: "",
    });

    const sheetResults = { round1: {}, table: {} };
    let matchNumber = 1;

    let round1Start = -1;
    let tableStart = -1;

    // Find indices for ROUND 1 and Tabela
    sheetData.forEach((row, index) => {
      if (
        row.some(
          (cell) => cell && cell.toString().toUpperCase().includes("ROUND 1")
        )
      ) {
        round1Start = index + 1;
      }
      if (
        row.some((cell) => cell && cell.toString().toUpperCase().includes("GP"))
      ) {
        tableStart = index + 1;
      }
    });

    // Parse ROUND 1 data
    if (round1Start !== -1) {
      for (let i = round1Start; i < sheetData.length; i++) {
        const row = sheetData[i];
        if (!row[0] || !row[1] || row.length < 5) break; // Stop if row is invalid
        sheetResults.round1[matchNumber] = {
          Player1: row[0],
          Player2: row[1],
          Score1: parseInt(row[2], 10) || 0,
          Score2: parseInt(row[4], 10) || 0,
        };
        matchNumber++;
      }
    }

    // Parse Tabela (table) data
    if (tableStart !== -1) {
      for (let i = tableStart; i < sheetData.length; i++) {
        const row = sheetData[i];
        if (!row[0] || row.length < 9) break; // Stop if row is invalid
        sheetResults.table[row[0]] = {
          GP: parseInt(row[1], 10) || 0,
          W: parseInt(row[2], 10) || 0,
          D: parseInt(row[3], 10) || 0,
          L: parseInt(row[4], 10) || 0,
          PF: parseInt(row[5], 10) || 0,
          PA: parseInt(row[6], 10) || 0,
          DIFF: parseInt(row[7], 10) || 0,
          PTS: parseInt(row[8], 10) || 0,
        };
      }
    }

    extractedData[sheetName] = sheetResults;
  });

  console.log("Extraction Result:", JSON.stringify(extractedData, null, 2));
  return extractedData;
};

const updateReactSourceFile = (extractedData) => {
  let pageContent = `
      <div className="card-body">
    `;

  Object.keys(extractedData).forEach((sheetName) => {
    if (sheetName === "35+ A" || sheetName === "35+ B") {
      const round1Data = extractedData[sheetName]?.round1 || {};
      const tableData = extractedData[sheetName]?.table || {};

      Object.values(round1Data).forEach((match, index) => {
        pageContent += `
        <div className="fixture mb-3">
          <p className="mb-1"><strong>${match.Player1} vs ${
          match.Player2
        }</strong></p>
          <p className="mb-1">Score: ${match.Score1} - ${match.Score2}</p>
          <p>Match Number: ${index + 1}</p>
        </div>
        <hr />
      `;
      });
    }
  });

  pageContent += `</div>`;

  const originalContent = fs.readFileSync(sourceFilePath, "utf-8");
  const updatedContent = originalContent.replace(
    /<div className="card-body"><\/div>/,
    `${pageContent}`
  );

  fs.writeFileSync(sourceFilePath, updatedContent, "utf-8");
  console.log("React source file updated successfully with dynamic pages!");
};

// API to handle file upload and processing
app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  try {
    const extractedData = processExcelFile(filePath);
    updateReactSourceFile(extractedData);
    res.send({
      message: "React source file updated successfully!",
      data: extractedData,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ message: "Failed to process Excel file." });
  } finally {
    fs.unlinkSync(filePath);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
