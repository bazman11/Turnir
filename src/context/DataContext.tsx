import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";

interface DataContextProps {
  standings: any[];
  games: any[];
  loading: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [standings, setStandings] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sheetNames = [
    "35+ A",
    "35+ B",
    "40+ A",
    "40+ B",
    "45+ A",
    "45+ B",
    "50+ A",
    "50+ B",
    "55+ A",
    "55+ B",
    "60+ A",
    "60+ B",
    "Z35+",
    "Z45+",
  ]; // Add more if needed

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: standingsData, error: standingsError } = await supabase
          .from("standings")
          .select(
            `
            id, sheet_name, games_played, wins, draws, losses, points,
            teams!standings_team_id_fkey(name)
          `
          )
          .in("sheet_name", sheetNames);

        if (standingsError) throw standingsError;

        const { data: gamesData, error: gamesError } = await supabase
          .from("games")
          .select(
            `
            id, sheet_name, round, score1, score2,
            team1:teams!games_team1_id_fkey(name), 
            team2:teams!games_team2_id_fkey(name)
          `
          )
          .in("sheet_name", sheetNames);

        if (gamesError) throw gamesError;

        setStandings(standingsData);
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ standings, games, loading }}>
      {children}
    </DataContext.Provider>
  );
};

// ✅ Custom hook to use the DataContext in other components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
