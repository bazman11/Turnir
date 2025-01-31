import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Upload from "./pages/Upload";
import Home from "./components/Home/Home";
import A35 from "./pages/A35";
import B35 from "./pages/B35";
import A60 from "./pages/A60";
import B60 from "./pages/B60";
import B55 from "./pages/B55";
import A55 from "./pages/A55";
import B50 from "./pages/B50";
import A50 from "./pages/A50";
import B40 from "./pages/B40";
import A40 from "./pages/A40";
import Z35A from "./pages/Z35A";
import Z35B from "./pages/Z35B";
import Z45A from "./pages/Z45A";
import Z45B from "./pages/Z45B";
import A45 from "./pages/A45";
import B45 from "./pages/B45";
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
    <Router>
      <Header />
      <Routes>
        {/* Redirect "/" to "/home" */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />
        <Route path="/35+/grupa-a" element={<A35 />} />
        <Route path="/35+/grupa-b" element={<B35 />} />
        <Route path="/40+/grupa-a" element={<A40 />} />
        <Route path="/40+/grupa-b" element={<B40 />} />
        <Route path="/45+/grupa-a" element={<A45 />} />
        <Route path="/45+/grupa-b" element={<B45 />} />
        <Route path="/50+/grupa-a" element={<A50 />} />
        <Route path="/50+/grupa-b" element={<B50 />} />
        <Route path="/55+/grupa-a" element={<A55 />} />
        <Route path="/55+/grupa-b" element={<B55 />} />
        <Route path="/60+/grupa-a" element={<A60 />} />
        <Route path="/60+/grupa-b" element={<B60 />} />
        <Route path="/Z35+/grupa-a" element={<Z35A />} />
        <Route path="/Z35+/grupa-b" element={<Z35B />} />
        <Route path="/Z45+/grupa-a" element={<Z45A />} />
        <Route path="/Z45+/grupa-b" element={<Z45B />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
};

export default App;
