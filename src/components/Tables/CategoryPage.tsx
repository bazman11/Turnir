import React from "react";
import { useData } from "../../context/DataContext";
import "../../pages/css/U15.css"

interface CategoryPageProps {
  title: string;
  sheetNames: string[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ title, sheetNames }) => {
  const { standings, games, loading } = useData();

  if (loading) return <p>Loading data...</p>;

  const groupA = standings.filter((s) => s.sheet_name === sheetNames[0]).sort((a, b) => b.points - a.points);
  const groupB = standings.filter((team) => team.sheet_name === sheetNames[1]).sort((a, b) => b.points - a.points);
  const fixtures = games.filter((g) => sheetNames.includes(g.sheet_name));

  return (
    <div className="row g-4">
      {/* Header Section */}
      <div className="header-container mb-4 text-center">
        <h1 className="kategorija">Kategorija: {title}</h1>
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
                  <div key={match.id} className="d-flex align-items-center mx-2 py-1">
                    <strong>{match.team1.name}</strong> ({match.score1}) vs ({match.score2}) <strong>{match.team2.name}</strong>
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
                  <li key={team.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {team.teams.name}
                    <span className="badge bg-secondary">{team.points} pts</span>
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
                  <li key={team.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {team.teams.name}
                    <span className="badge bg-secondary">{team.points} pts</span>
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

export default CategoryPage;
