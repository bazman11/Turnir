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

        const sheetResults: Record<string, any> = { table: {} };
        let currentRound: string | null = null;

        // Scan the sheet and extract all rounds dynamically
        sheetData.forEach((row, index) => {
          if (
            row.some((cell) => cell?.toString().toUpperCase().includes("ROUND"))
          ) {
            const roundNumber = row
              .find((cell) => cell?.toString().toUpperCase().includes("ROUND"))
              ?.toString()
              .split(" ")[1];
            currentRound = `round${roundNumber}`;
            sheetResults[currentRound] = {}; // Initialize the round
          }

          // If we are in a round and data is found, extract match results
          if (
            currentRound &&
            row[0] &&
            row[1] &&
            row.length >= 5 &&
            !isNaN(parseInt(row[2], 10)) &&
            !isNaN(parseInt(row[4], 10))
          ) {
            const matchNumber =
              Object.keys(sheetResults[currentRound]).length + 1;
            sheetResults[currentRound][matchNumber] = {
              Player1: row[0],
              Player2: row[1],
              Score1: parseInt(row[2], 10) || 0,
              Score2: parseInt(row[4], 10) || 0,
            };
          }
        });

        // Find table data (standings)
        const tableStartIndex = sheetData.findIndex((row) =>
          row.some((cell) => cell?.toString().toUpperCase().includes("GP"))
        );

        if (tableStartIndex !== -1) {
          for (let i = tableStartIndex + 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            const teamName = row[7];
            console.log(teamName)
            if (teamName && teamName !== "Tabela" && teamName!=="Table") {
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

      console.log("Extracted data:", extractedData);
      resolve(extractedData);
    };

    reader.onerror = (error) => reject(error);
  });
};

export const saveToDatabase = async (extractedData: any) => {
  await supabase.from("games").delete().neq("id", 0);
  await supabase.from("standings").delete().neq("id", 0);

  for (const sheetName of Object.keys(extractedData)) {
    console.log("Extracted data for sheet:", sheetName);
    const sheetResults = extractedData[sheetName];

    Object.keys(sheetResults).forEach(async (key) => {
      if (key.startsWith("round")) {
        const roundNumber = parseInt(key.replace("round", ""), 10);
        const roundData = sheetResults[key];

        for (const match of Object.values(roundData)) {
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
                  round: roundNumber,
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
      }
    });

    if (sheetResults.table) {
      for (const [teamName, stats] of Object.entries(sheetResults.table)) {
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
                PF: stats.PF,
                PA: stats.PA,
                DIFF: stats.DIFF,
              },
            ],
            { onConflict: ["sheet_name", "team_id"] }
          );
        }
      }
    }
  }
};
