import { Table } from "react-bootstrap";

const FixturesTable = ({ fixtures }) => {
  return (
    <div className="overflow-x-auto">
      {fixtures && fixtures.length > 0 ? (
        <Table hover className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Match</th>
              <th className="py-3 px-4 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {fixtures.map((match) => (
              <tr key={match.id} className="border-b">
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {match.team1?.name || "Team 1"}
                    </span>
                    <span>{"-"}</span>
                    <span className="font-medium">
                      {match.team2?.name || "Team 2"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-gray-200 rounded px-2 py-1 text-sm font-semibold text-gray-700">
                    {match.score1 ?? "-"} - {match.score2 ?? "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-gray-500 text-center p-4">No fixtures available.</p>
      )}
    </div>
  );
};

export default FixturesTable;
