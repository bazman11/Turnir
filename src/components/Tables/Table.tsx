import React from "react";

const Table = ({ standings }) => {
  return (
    <div className="card-body">
      {standings.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover text-center">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>GP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>PF</th>
                <th>PA</th>
                <th>DIFF</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr key={team.team_id}>
                  <td>{index + 1}</td>
                  <td className="text-start">
                    <strong>{team.teams?.name || "Unknown"}</strong>
                  </td>
                  <td>{team.games_played}</td>
                  <td>{team.wins}</td>
                  <td>{team.draws}</td>
                  <td>{team.losses}</td>
                  <td>{team.PF}</td>
                  <td>{team.PA}</td>
                  <td>{team.DIFF}</td>
                  <td>
                    <span className="badge bg-success">{team.points}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted text-center">No data available.</p>
      )}
    </div>
  );
};

export default Table;
