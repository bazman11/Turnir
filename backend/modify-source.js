import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import express from "express";
import multer from "multer";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = 5050;

const upload = multer({ dest: "uploads/" });

// const sourceFilePath = path.join(__dirname, "../src/pages/A35.tsx");

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

    const tableDataStartRow = 5; // Row index 6 (zero-based)
    const tableDataStartColumn = 7; // Column H (zero-based)
    const numberOfRowsToExtract = 9; // Rows to extract

    if (sheetData.length > tableDataStartRow) {
      for (
        let i = tableDataStartRow;
        i < tableDataStartRow + numberOfRowsToExtract && i < sheetData.length;
        i++
      ) {
        const row = sheetData[i];
        const teamName = row[tableDataStartColumn];
        if (teamName) {
          sheetResults.table[teamName] = {
            GP: parseInt(row[tableDataStartColumn + 1], 10) || 0,
            W: parseInt(row[tableDataStartColumn + 2], 10) || 0,
            D: parseInt(row[tableDataStartColumn + 3], 10) || 0,
            L: parseInt(row[tableDataStartColumn + 4], 10) || 0,
            PF: parseInt(row[tableDataStartColumn + 5], 10) || 0,
            PA: parseInt(row[tableDataStartColumn + 6], 10) || 0,
            DIFF: parseInt(row[tableDataStartColumn + 7], 10) || 0,
            PTS: parseInt(row[tableDataStartColumn + 8], 10) || 0,
          };
        }
      }
    }

    extractedData[sheetName] = sheetResults;
  });

  return extractedData;
};

const updateReactSourceFile = (extractedData) => {
  Object.keys(extractedData).forEach((sheetName) => {
    let fileName;

    // Map sheet names to file names
    if (sheetName === "35+ A") fileName = "A35.tsx";
    else if (sheetName === "35+ B") fileName = "B35.tsx";
    else if (sheetName === "40+ A") fileName = "A40.tsx";
    else if (sheetName === "40+ B") fileName = "B40.tsx";
    else if (sheetName === "45+ A") fileName = "A45.tsx";
    else if (sheetName === "45+ B") fileName = "B45.tsx";
    else if (sheetName === "50+ A") fileName = "A50.tsx";
    else if (sheetName === "50+ B") fileName = "B50.tsx";
    else if (sheetName === "35+ Ž") fileName = "Z35A.tsx";
    else if (sheetName === "45+ Ž") fileName = "Z45A.tsx";
    else return; // Skip sheets that don't have a corresponding file

    // Construct the file path
    const filePath = path.join(__dirname, `../src/pages/${fileName}`);

    const round1Data = extractedData[sheetName]?.round1 || {};
    const tableData = extractedData[sheetName]?.table || {};

    let pageContent = `
      <div className="card-body">
    `;

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

    let tableContent = `
    <ul className="list-group">
  `;

    Object.entries(tableData).forEach(([teamName, teamStats]) => {
      tableContent += `
      <li className="list-group-item">
        <div className="d-flex justify-content-between align-items-center">
          <span className="team-name">${teamName}</span>
          <span className="badge bg-primary rounded-pill">
            ${teamStats.PTS}
          </span>
        </div>
      </li>
    `;
    });

    const originalContent = fs.readFileSync(filePath, "utf-8");
    const updatedContent = originalContent.replace(
      /<div className="card-body">/,
      `${pageContent}`
    );
    const updateContentTable = updatedContent.replace(
      /<ul className="list-group">/,
      `${tableContent}`
    );

    fs.writeFileSync(filePath, updateContentTable, "utf-8");
    console.log(`File ${fileName} updated successfully!`);
  });
};

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
