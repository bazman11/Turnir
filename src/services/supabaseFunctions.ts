import * as XLSX from "xlsx";
import supabase from "../supabaseClient";

export const processExcelFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return reject("No data found in file");

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetNames = workbook.SheetNames;

      const extractedData: Record<string, any> = {};

      sheetNames.forEach((sheetName) => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          defval: "",
        });

        const sheetResults = { round1: {}, table: {} };
        let matchNumber = 1;
        let round1Start = -1;
        let tableStart = -1;

        // Find indices for ROUND 1 and Table
        sheetData.forEach((row, index) => {
          if (
            row.some((cell) =>
              cell?.toString().toUpperCase().includes("ROUND 1")
            )
          ) {
            round1Start = index + 1;
          }
          if (
            row.some((cell) => cell?.toString().toUpperCase().includes("GP"))
          ) {
            tableStart = index + 1;
          }
        });

        // Parse ROUND 1 data
        if (round1Start !== -1) {
          for (let i = round1Start; i < sheetData.length; i++) {
            const row = sheetData[i];
            if (!row[0] || !row[1] || row.length < 5) break;

            sheetResults.round1[matchNumber] = {
              Player1: row[0],
              Player2: row[1],
              Score1: parseInt(row[2], 10) || 0,
              Score2: parseInt(row[4], 10) || 0,
            };
            matchNumber++;
          }
        }

        // Parse Table Data
        if (tableStart !== -1) {
          for (let i = tableStart; i < sheetData.length; i++) {
            const row = sheetData[i];
            const teamName = row[7];
            if (teamName) {
              sheetResults.table[teamName] = {
                GP: parseInt(row[8], 10) || 0,
                W: parseInt(row[9], 10) || 0,
                D: parseInt(row[10], 10) || 0,
                L: parseInt(row[11], 10) || 0,
                PF: parseInt(row[12], 10) || 0,
                PA: parseInt(row[13], 10) || 0,
                DIFF: parseInt(row[14], 10) || 0,
                PTS: parseInt(row[15], 10) || 0,
              };
            }
          }
        }

        extractedData[sheetName] = sheetResults;
      });

      resolve(extractedData);
    };

    reader.onerror = (error) => reject(error);
  });
};

// ✅ Function to save extracted data to Supabase
export const saveToDatabase = async (extractedData: any) => {
  for (const sheetName of Object.keys(extractedData)) {
    const { round1, table } = extractedData[sheetName];

    // Insert or update game results
    for (const match of Object.values(round1)) {
      const { Player1, Player2, Score1, Score2 } = match;

      await supabase
        .from("teams")
        .upsert([{ name: Player1 }], { onConflict: ["name"] });
      await supabase
        .from("teams")
        .upsert([{ name: Player2 }], { onConflict: ["name"] });

      const team1Res = await supabase
        .from("teams")
        .select("id")
        .eq("name", Player1)
        .single();
      const team2Res = await supabase
        .from("teams")
        .select("id")
        .eq("name", Player2)
        .single();

      if (team1Res.data && team2Res.data) {
        await supabase.from("games").upsert(
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

    // Insert or update standings
    for (const [teamName, stats] of Object.entries(table)) {
      await supabase
        .from("teams")
        .upsert([{ name: teamName }], { onConflict: ["name"] });

      const teamRes = await supabase
        .from("teams")
        .select("id")
        .eq("name", teamName)
        .single();

      if (teamRes.data) {
        await supabase.from("standings").upsert(
          [
            {
              sheet_name: sheetName,
              team_id: teamRes.data.id,
              games_played: stats.GP,
              wins: stats.W,
              draws: stats.D,
              losses: stats.L,
              points: stats.PTS,
            },
          ],
          { onConflict: ["sheet_name", "team_id"] }
        );
      }
    }
  }
};
