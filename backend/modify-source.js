import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]):/, "$1:");

const app = express();
const PORT = 5050;
const upload = multer({ dest: "uploads/" });

// ✅ Initialize Supabase
const SUPABASE_URL = "https://ioypnpnhzetxdzisfvco.supabase.co";  // Replace with your actual Supabase URL
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveXBucG5oemV0eGR6aXNmdmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNjczMjgsImV4cCI6MjA1Mzg0MzMyOH0.3rMmmfiavH_4irZHA21fCwPUxnuvfWNVtW-Liu0H08A";     // Replace with your Service Role Key (server-side only)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✅ Process Excel File
const processExcelFile = async (filePath) => {
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

// ✅ Save Data to Supabase
const saveToDatabase = async (extractedData) => {
  for (const sheetName of Object.keys(extractedData)) {
    const { round1, table } = extractedData[sheetName];

    // ✅ Insert or update teams and game results
    for (const match of Object.values(round1)) {
      const { Player1, Player2, Score1, Score2 } = match;

      // Insert or update teams in "teams" table
      await supabase.from("teams").upsert([{ name: Player1 }], { onConflict: ["name"] });
      await supabase.from("teams").upsert([{ name: Player2 }], { onConflict: ["name"] });

      const team1Res = await supabase.from("teams").select("id").eq("name", Player1).single();
      const team2Res = await supabase.from("teams").select("id").eq("name", Player2).single();

      if (team1Res.data && team2Res.data) {
        await supabase
          .from("games")
          .upsert(
            [
              {
                round: 1,
                sheet_name: sheetName,
                team1_id: team1Res.data.id,
                team2_id: team2Res.data.id,
                score1: Score1,
                score2: Score2,
              },
            ],
            { onConflict: ["round", "sheet_name", "team1_id", "team2_id"] }
          );
      }
    }

    // ✅ Insert or update standings data
    for (const [teamName, stats] of Object.entries(table)) {
      await supabase.from("teams").upsert([{ name: teamName }], { onConflict: ["name"] });

      const teamRes = await supabase.from("teams").select("id").eq("name", teamName).single();

      if (teamRes.data) {
        const existingStanding = await supabase
          .from("standings")
          .select("*")
          .eq("sheet_name", sheetName)
          .eq("team_id", teamRes.data.id)
          .single();

        if (existingStanding.data) {
          // ✅ If the team already exists, update its standing
          await supabase
            .from("standings")
            .update({
              games_played: stats.GP, // Replace with new value
              wins: stats.W,
              draws: stats.D,
              losses: stats.L,
              points: stats.PTS,
            })
            .eq("sheet_name", sheetName)
            .eq("team_id", teamRes.data.id);
        } else {
          // ✅ If the team doesn't exist, insert a new row
          await supabase
            .from("standings")
            .insert([
              {
                sheet_name: sheetName,
                team_id: teamRes.data.id,
                games_played: stats.GP,
                wins: stats.W,
                draws: stats.D,
                losses: stats.L,
                points: stats.PTS,
              },
            ]);
        }
      }
    }
  }
};


// ✅ Upload API
app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  try {
    const extractedData = await processExcelFile(filePath);
    await saveToDatabase(extractedData);
    res.send({
      message: "Data uploaded to Supabase successfully!",
      data: extractedData,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ message: "Failed to process Excel file." });
  } finally {
    fs.unlinkSync(filePath);
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
