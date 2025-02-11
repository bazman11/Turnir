import * as XLSX from "xlsx";
import supabase from "../supabaseClient";

interface Match {
  Player1: string;
  Player2: string;
  Score1: number;
  Score2: number;
}

interface Stats {
  GP: number;
  W: number;
  D: number;
  L: number;
  PTS: number;
  PF: number;
  PA: number;
  DIFF: number;
}

interface SheetResults {
  [key: string]: Record<string, Match> | { table: Record<string, Stats> };
}

export const processExcelFile = async (
  file: File
): Promise<Record<string, SheetResults>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return reject("No data found in file");

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetNames = workbook.SheetNames;
      const extractedData: Record<string, SheetResults> = {};

      sheetNames.forEach((sheetName) => {
        const sheetData: string[][] = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName],
          {
            header: 1,
            defval: "",
          }
        );

        const sheetResults: SheetResults = { table: {} };
        let currentRound: string | null = null;

        sheetData.forEach((row: string[]) => {
          if (
            row.some((cell) => cell?.toString().toUpperCase().includes("ROUND"))
          ) {
            const roundNumber = row
              .find((cell) => cell?.toString().toUpperCase().includes("ROUND"))
              ?.toString()
              .split(" ")[1];

            currentRound = `round${roundNumber}`;
            sheetResults[currentRound] = {};
          }

          if (
            currentRound &&
            row[0] &&
            row[1] &&
            row.length >= 5 &&
            !isNaN(Number(row[2])) &&
            !isNaN(Number(row[4]))
          ) {
            const matchNumber =
              Object.keys(sheetResults[currentRound]).length + 1;
            (sheetResults[currentRound] as Record<string, Match>)[matchNumber] =
              {
                Player1: row[0],
                Player2: row[1],
                Score1: Number(row[2]) || 0,
                Score2: Number(row[4]) || 0,
              };
          }
        });

        // Process Standings (Table)
        const tableStartIndex = sheetData.findIndex((row) =>
          row.some((cell) => cell?.toString().toUpperCase().includes("GP"))
        );

        if (tableStartIndex !== -1) {
          for (let i = tableStartIndex + 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            const teamName = row[7];
            if (teamName && teamName !== "Tabela" && teamName !== "Table") {
              if ("table" in sheetResults) {
                sheetResults.table[teamName] = {
                  GP: Number(row[8]) || 0,
                  W: Number(row[9]) || 0,
                  D: Number(row[10]) || 0,
                  L: Number(row[11]) || 0,
                  PF: Number(row[12]) || 0,
                  PA: Number(row[13]) || 0,
                  DIFF: Number(row[14]) || 0,
                  PTS: Number(row[15]) || 0,
                };
              }
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

export const saveToDatabase = async (
  extractedData: Record<string, SheetResults>
) => {
  await supabase.from("games").delete().neq("id", 0);
  await supabase.from("standings").delete().neq("id", 0);

  for (const sheetName of Object.keys(extractedData)) {
    const sheetResults = extractedData[sheetName];

    for (const key of Object.keys(sheetResults)) {
      if (key.startsWith("round")) {
        const roundNumber = parseInt(key.replace("round", ""), 10);
        const roundData = sheetResults[key];

        for (const match of Object.values(roundData as Record<string, Match>)) {
          const { Player1, Player2, Score1, Score2 } = match;

          await supabase
            .from("teams")
            .upsert([{ name: Player1 }], { onConflict: "name" });
          await supabase
            .from("teams")
            .upsert([{ name: Player2 }], { onConflict: "name" });

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

          if (!team1Res.data || !team2Res.data) {
            console.error(`Missing team: ${Player1} or ${Player2}`);
            continue;
          }

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
            { onConflict: "round,sheet_name,team1_id,team2_id" }
          );
        }
      }
    }

    // Process Standings (Table)
    if ("table" in sheetResults) {
      for (const [teamName, stats] of Object.entries(sheetResults.table)) {
        await supabase
          .from("teams")
          .upsert([{ name: teamName }], { onConflict: "name" });

        const teamRes = await supabase
          .from("teams")
          .select("id")
          .eq("name", teamName)
          .single();

        if (!teamRes.data) {
          console.error(`No team found for ${teamName}`);
          continue;
        }

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
          { onConflict: "sheet_name,team_id" }
        );
      }
    }
  }
};
