import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import express from "express";
import multer from "multer";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = 5050;

const upload = multer({ dest: "uploads/" });

const sourceFilePath = path.join(__dirname, "../src/App.tsx");

const processExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  const extractedData = {}; // Top-level object to store data grouped by sheets

  sheetNames.forEach((sheetName) => {
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "", // Prevent undefined values
    });

    const sheetResults = { round1: {}, table: {} }; // Separate round1 and table data for this sheet
    let matchNumber = 1;
    let isRound1 = false; // Flag to determine if we're in the ROUND 1 section
    let isTable = false; // Flag to determine if we're in the TABLE section

    sheetData.forEach((row) => {
      // Detect the start of the ROUND 1 section
      if (Object.values(row).includes("ROUND 1")) {
        isRound1 = true;
        isTable = false;
        return; // Skip this row
      }

      // Detect the start of the TABLE section
      if (
        Object.values(row).includes("GP") ||
        Object.values(row).includes("Tabela")
      ) {
        isTable = true;
        isRound1 = false;
        return; // Skip this row
      }

      // Extract ROUND 1 data
      if (isRound1) {
        const keys = Object.keys(row);
        if (
          row[keys[0]] && // Player1
          row[keys[1]] && // Player2
          row[keys[2]] && // Score1
          row[keys[4]] // Score2
        ) {
          sheetResults.round1[matchNumber] = {
            Player1: row[keys[0]],
            Player2: row[keys[1]],
            Score1: parseInt(row[keys[2]], 10),
            Score2: parseInt(row[keys[4]], 10),
          };
          matchNumber++;
        }
      }

      // Extract TABLE data
      if (isTable) {
        const keys = Object.keys(row);
        if (row[keys[0]]) {
          sheetResults.table[row[keys[0]]] = {
            GP: parseInt(row[keys[1]], 10) || 0,
            W: parseInt(row[keys[2]], 10) || 0,
            D: parseInt(row[keys[3]], 10) || 0,
            L: parseInt(row[keys[4]], 10) || 0,
            PF: parseInt(row[keys[5]], 10) || 0,
            PA: parseInt(row[keys[6]], 10) || 0,
            DIFF: parseInt(row[keys[7]], 10) || 0,
            PTS: parseInt(row[keys[8]], 10) || 0,
          };
        }
      }
    });

    // Store the extracted data for this sheet under its title
    extractedData[sheetName] = sheetResults;
  });

  console.log("Extraction mi je ", extractedData);
  return extractedData;
};

const updateReactSourceFile = (extractedData) => {
  // Generate dynamic routes and components for each sheet
  let dynamicRoutes = ``;

  Object.keys(extractedData).forEach((sheetName) => {
    const round1Data = extractedData[sheetName]?.round1 || {};
    const tableData = extractedData[sheetName]?.table || {};

    // Generate content for fixtures and leaderboard
    let pageContent = `
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Fixtures</h5>
              </div>
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

    pageContent += `
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Leaderboard</h5>
              </div>
              <div className="card-body">
                <ul className="list-group">
    `;

    Object.keys(tableData).forEach((teamName) => {
      const teamStats = tableData[teamName];
      pageContent += `
        <li className="list-group-item d-flex justify-content-between align-items-center">
          ${teamName}
          <span className="badge bg-primary rounded-pill">${teamStats.PTS} Points</span>
        </li>
      `;
    });

    pageContent += `
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Generate a component for this sheet
    dynamicRoutes += `
      <Route path="/${sheetName.replace(
        /\s+/g,
        "_"
      )}" element={<>${pageContent}</>} />
    `;
  });

  // Replace the App.tsx content with dynamic routes
  const originalContent = fs.readFileSync(sourceFilePath, "utf-8");
  const updatedContent = originalContent.replace(
    /<Routes>[\s\S]*<\/Routes>/,
    `<Routes>${dynamicRoutes}</Routes>`
  );

  fs.writeFileSync(sourceFilePath, updatedContent, "utf-8");
  console.log("React source file updated successfully with dynamic pages!");
};

// // Function to update the React source file with the extracted JSON
// const updateReactSourceFile = (extractedData) => {
//   // const originalContent = fs.readFileSync(sourceFilePath, "utf-8");

//   // const updatedContent = originalContent.replace(
//   //   /<div>proba<\/div>/,
//   //   `\n<div>${JSON.stringify(extractedData, null, 2)}</div>\n<div>proba</div>`
//   // );
//   let fixturesContent = `
//   <div className="row">
//     <div className="col-md-6">
//       <div className="card shadow-sm">
//         <div className="card-header bg-primary text-white">
//           <h5 className="mb-0">Fixtures</h5>
//         </div>
//         <div className="card-body">
// `;
//   //data u tabeli
//   Object.keys(extractedData).forEach((sheetName) => {
//     const round1Data = extractedData[sheetName]?.round1 || {};

//     Object.values(round1Data).forEach((match, index) => {
//       fixturesContent += `
//       <div className="fixture mb-3">
//         <p className="mb-1"><strong>${match.Player1} vs ${
//         match.Player2
//       }</strong></p>
//         <p className="mb-1">Score: ${match.Score1} - ${match.Score2}</p>
//         <p>Match Number: ${index + 1}</p>
//       </div>
//       <hr />
//     `;
//     });
//   });
//   //kraj tabe;e
//   fixturesContent += `
//           </div>
//         </div>
//       </div>
//   `;

//   // Start the Leaderboard content
//   let leaderboardContent = `
//    <div className="col-md-6">
//      <div className="card shadow-sm">
//        <div className="card-header bg-success text-white">
//          <h5 className="mb-0">Leaderboard</h5>
//        </div>
//        <div className="card-body">
//          <ul className="list-group">
// `;

//   // Dynamically generate leaderboard items from table data
//   Object.keys(extractedData).forEach((sheetName) => {
//     const tableData = extractedData[sheetName]?.table || {};

//     Object.keys(tableData).forEach((teamName) => {
//       const teamStats = tableData[teamName];
//       leaderboardContent += `
//      <li className="list-group-item d-flex justify-content-between align-items-center">
//        ${teamName}
//        <span className="badge bg-primary rounded-pill">${teamName.PTS} Points</span>
//      </li>
//    `;
//     });
//   });

//   // Close the leaderboard content
//   leaderboardContent += `
//          </ul>
//        </div>
//      </div>
//    </div>
//  </div>
// `;

//   // Combine fixtures and leaderboard content
//   const fullContent = `
//  <div className="container mt-4">
//    ${fixturesContent}
//    ${leaderboardContent}
//  </div>
// `;
//   const originalContent = fs.readFileSync(sourceFilePath, "utf-8");
//   const updatedContent = originalContent.replace(
//     /<div>proba<\/div>/,
//     fullContent + "\n<div>proba</div>"
//   );
//   fs.writeFileSync(sourceFilePath, updatedContent, "utf-8");
//   console.log("React source file updated successfully!");
// };

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
