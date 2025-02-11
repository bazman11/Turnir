import { Table } from "react-bootstrap";

const LeaderboardTable = ({ standings }) => {
  return (
    <div className="overflow-x-auto">
      {standings && standings.length > 0 ? (
        <Table hover className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Team</th>
              <th className="py-3 px-4 text-center">GP</th>
              <th className="py-3 px-4 text-center">W</th>
              <th className="py-3 px-4 text-center">L</th>
              <th className="py-3 px-4 text-center">PF</th>
              <th className="py-3 px-4 text-center">PA</th>
              <th className="py-3 px-4 text-center">DIFF</th>
              <th className="py-3 px-4 text-center">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.team_id || index} className="border-b">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4 font-medium">
                  {team.teams?.name || "Unknown"}
                </td>
                <td className="py-3 px-4 text-center">
                  {team.games_played ?? "-"}
                </td>
                <td className="py-3 px-4 text-center">{team.wins ?? "-"}</td>
                <td className="py-3 px-4 text-center">{team.losses ?? "-"}</td>
                <td className="py-3 px-4 text-center">{team.PF ?? "-"}</td>
                <td className="py-3 px-4 text-center">{team.PA ?? "-"}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={
                      team.DIFF > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {team.DIFF > 0 ? "+" : ""}
                    {team.DIFF ?? "-"}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-semibold">
                  {team.points ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-gray-500 text-center p-4">No data available.</p>
      )}
    </div>
  );
};

export default LeaderboardTable;
