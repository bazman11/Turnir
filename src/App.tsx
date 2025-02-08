import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Upload from "./pages/Upload";
import Home from "./components/Home/Home";
import M35 from "./pages/M35";
import M40 from "./pages/M40";
import M45 from "./pages/M45";
import M50 from "./pages/M50";
import M55 from "./pages/M55";
import M60 from "./pages/M60";
import Z35 from "./pages/Z35";
import Z45 from "./pages/Z45";
import { DataProvider } from "./context/DataContext";
//import supabase from "./supabaseClient";

const App: React.FC = () => {
  const [standings, setStandings] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sheetName1 = "35+ A";
  const sheetName2 = "35+ B";

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       // ✅ Fetch Standings with Correct Foreign Key Reference
  //       const { data: standingsData, error: standingsError } = await supabase
  //         .from("standings")
  //         .select(`
  //           id, sheet_name, games_played, wins, draws, losses, points,
  //           teams!standings_team_id_fkey(name)  -- Correct FK reference
  //         `)
  //         .in("sheet_name", [sheetName1, sheetName2]);

  //       if (standingsError) throw standingsError;

  //       // ✅ Fetch Games with Explicit Relationship Names
  //       const { data: gamesData, error: gamesError } = await supabase
  //         .from("games")
  //         .select(`
  //           id, sheet_name, round, score1, score2,
  //           team1:teams!games_team1_id_fkey(name),
  //           team2:teams!games_team2_id_fkey(name)
  //         `)
  //         .in("sheet_name", [sheetName1, sheetName2]);

  //       if (gamesError) throw gamesError;

  //       console.log("✅ Standings Data:", standingsData);
  //       console.log("✅ Games Data:", gamesData);

  //       setStandings(standingsData);
  //       setGames(gamesData);
  //     } catch (error) {
  //       console.error("❌ Error fetching data:", error);
  //     }
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, []);

  return (
    <DataProvider>
      <Router>
        <Header />
        <Routes>
          {/* Redirect "/" to "/home" */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<Home />} />

          {/* M35 (35+) Route */}
          <Route path="/M35" element={<M35 />} />

          {/* M40 (40+) Route */}
          <Route path="/M40" element={<M40 />} />

          {/* M45 (45+) Route */}
          <Route path="/M45" element={<M45 />} />

          {/* M50 (50+) Route */}
          <Route path="/M50" element={<M50 />} />

          {/* M55 (55+) Route */}
          <Route path="/M55" element={<M55 />} />

          {/* M60 (60+) Route */}
          <Route path="/M60" element={<M60 />} />

          {/* Z35 (Ž35+) Route */}
          <Route path="/Z35" element={<Z35 />} />

          {/* Z45 (Ž45+) Route */}
          <Route path="/Z45" element={<Z45 />} />

          {/* Upload Page */}
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
