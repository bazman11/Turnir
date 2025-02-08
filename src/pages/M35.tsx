import React, { useEffect } from "react";
//import "./css/U15.css";
import { useData } from "../context/DataContext";

// Mock Data
const teamsData = [
  {
    id: 13,
    sheet_name: "35+ A",
    games_played: 2,
    wins: 2,
    draws: 0,
    losses: 0,
    points: 4,
    teams: { name: "PRISTAN BAR" },
  },
  {
    id: 14,
    sheet_name: "35+ A",
    games_played: 2,
    wins: 1,
    draws: 0,
    losses: 1,
    points: 3,
    teams: { name: "PODGORICA" },
  },
  {
    id: 15,
    sheet_name: "35+ A",
    games_played: 2,
    wins: 0,
    draws: 0,
    losses: 2,
    points: 2,
    teams: { name: "STROŽANAC" },
  },
  {
    id: 16,
    sheet_name: "35+ B",
    games_played: 2,
    wins: 2,
    draws: 0,
    losses: 0,
    points: 4,
    teams: { name: "JAZINE" },
  },
  {
    id: 17,
    sheet_name: "35+ B",
    games_played: 2,
    wins: 1,
    draws: 0,
    losses: 1,
    points: 3,
    teams: { name: "BAR" },
  },
  {
    id: 18,
    sheet_name: "35+ B",
    games_played: 2,
    wins: 0,
    draws: 0,
    losses: 2,
    points: 2,
    teams: { name: "BUDVA" },
  },
];

const fixturesData = [
  {
    id: 37,
    sheet_name: "35+ A",
    round: 1,
    score1: 30,
    score2: 21,
    team1: { name: "PRISTAN BAR" },
    team2: { name: "STROŽANAC" },
  },
  {
    id: 38,
    sheet_name: "35+ A",
    round: 1,
    score1: 27,
    score2: 37,
    team1: { name: "STROŽANAC" },
    team2: { name: "PODGORICA" },
  },
  {
    id: 39,
    sheet_name: "35+ A",
    round: 1,
    score1: 29,
    score2: 30,
    team1: { name: "PODGORICA" },
    team2: { name: "PRISTAN BAR" },
  },
  {
    id: 40,
    sheet_name: "35+ B",
    round: 1,
    score1: 32,
    score2: 33,
    team1: { name: "BUDVA" },
    team2: { name: "BAR" },
  },
  {
    id: 41,
    sheet_name: "35+ B",
    round: 1,
    score1: 30,
    score2: 40,
    team1: { name: "BAR" },
    team2: { name: "JAZINE" },
  },
  {
    id: 42,
    sheet_name: "35+ B",
    round: 1,
    score1: 64,
    score2: 56,
    team1: { name: "JAZINE" },
    team2: { name: "BUDVA" },
  },
];

const M35: React.FC = () => {
  const { standings, games, loading } = useData();

  if (loading) return <p>Loading data...</p>;

  const filteredStandings = standings.filter((s) => s.sheet_name === "35+ A");
  const filteredGames = games.filter((g) => g.sheet_name === "35+ A");

  useEffect(() => {
    console.log("FIlter data je ", filteredStandings);
    console.log("Data je ", filteredGames);
  }, []);
  // Separate groups
  const groupA = teamsData
    .filter((team) => team.sheet_name === "35+ A")
    .sort((a, b) => b.points - a.points);
  const groupB = teamsData
    .filter((team) => team.sheet_name === "35+ B")
    .sort((a, b) => b.points - a.points);
  const fixtures = fixturesData;

  return (
    <div className="row g-4">
      {/* Header Section */}
      <div className="header-container mb-4 text-center">
        <h1 className="kategorija">Kategorija: Muškarci 35+</h1>
      </div>

      {/* Fixtures */}
      <div className="col-md-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white text-center py-2">
            <h5 className="mb-0">Fixtures</h5>
          </div>
          <div className="card-body p-2">
            {fixtures.length > 0 ? (
              <div className="d-flex flex-wrap justify-content-center">
                {fixtures.map((match) => (
                  <div
                    key={match.id}
                    className="d-flex align-items-center mx-2 py-1"
                  >
                    <strong>{match.team1.name}</strong> ({match.score1}) vs (
                    {match.score2}) <strong>{match.team2.name}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center">No fixtures available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Group A Leaderboard */}
      <div className="col-md-4">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-success text-white text-center">
            <h5 className="mb-0">Leaderboard - Grupa A</h5>
          </div>
          <div className="card-body">
            {groupA.length > 0 ? (
              <ul className="list-group">
                {groupA.map((team) => (
                  <li
                    key={team.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {team.teams.name}
                    <span className="badge bg-secondary">
                      {team.points} pts
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center">No data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Group B Leaderboard */}
      <div className="col-md-4">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-warning text-white text-center">
            <h5 className="mb-0">Leaderboard - Grupa B</h5>
          </div>
          <div className="card-body">
            {groupB.length > 0 ? (
              <ul className="list-group">
                {groupB.map((team) => (
                  <li
                    key={team.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {team.teams.name}
                    <span className="badge bg-secondary">
                      {team.points} pts
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center">No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default M35;
