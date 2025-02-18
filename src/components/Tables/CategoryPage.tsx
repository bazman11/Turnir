import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import LeaderboardTable from "./LeaderboardTable";
import FixturesTable from "./FixturesTable";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";

interface CategoryPageProps {
  title: string;
  sheetNames: string[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ title, sheetNames }) => {
  const { standings, games, loading } = useData();
  const [view, setView] = useState("tables"); // 'tables' or 'fixtures'

  if (loading) return <div className="loader">Loading...</div>;

  const isSingleTable = sheetNames.some(
    (name) => name === "35+ Ž" || name === "40+ Ž" || name === "45+ Ž"
  );
  console.log(standings)

  const groupA = standings
    .filter((s) => s.sheet_name === sheetNames[0])
    .sort((a, b) => b.points - a.points);
  const groupB = standings
    .filter((team) => team.sheet_name === sheetNames[1])
    .sort((a, b) => b.points - a.points);

  const groupedFixtures = games
    .filter((game) => sheetNames.includes(game.sheet_name))
    .reduce((acc, game) => {
      acc[game.round] = acc[game.round] || [];
      acc[game.round].push(game);
      return acc;
    }, {});

  return (
    <Container fluid className="py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-4 text-4xl font-bold text-gray-800">
          Kategorija: {title || "Unknown"}
        </h1>
      </motion.div>

      {/* Buttons for switching views - Sticky while scrolling */}
      <div className="d-flex justify-content-center mb-4 position-sticky top-0 w-100 bg-white py-3 shadow-sm z-3">
        <Button
          variant={view === "tables" ? "primary" : "secondary"}
          className="mx-2 px-4"
          onClick={() => setView("tables")}
        >
          Tabela
        </Button>
        <Button
          variant={view === "fixtures" ? "primary" : "secondary"}
          className="mx-2 px-4"
          onClick={() => setView("fixtures")}
        >
          Rezultati
        </Button>
      </div>

      <div className="mt-3">
        {" "}
        {/* Added margin to prevent overlap */}
        {view === "tables" ? (
          isSingleTable ? (
            <Row className="gx-5">
              <Col lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white shadow-lg rounded-lg overflow-hidden mb-5 p-4"
                >
                  <h2 className="text-center">Standings</h2>
                  <LeaderboardTable standings={groupA} />
                </motion.div>
              </Col>
            </Row>
          ) : (
            <Row className="gx-5">
              <Col lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white shadow-lg rounded-lg overflow-hidden mb-5 p-4"
                >
                  <h2 className="text-center">Tabela grupa A</h2>
                  <LeaderboardTable standings={groupA} />
                </motion.div>
              </Col>
              <Col lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white shadow-lg rounded-lg overflow-hidden p-4"
                >
                  <h2 className="text-center">Tabela grupa B</h2>
                  <LeaderboardTable standings={groupB} />
                </motion.div>
              </Col>
            </Row>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden p-4"
          >
            <h2 className="text-center">Fixtures</h2>
            {Object.entries(groupedFixtures).map(([round, matches]) => (
              <div key={round} className="mb-4">
                <h3 className="text-center text-lg font-bold bg-gray-200 py-2 rounded">
                  Round {round}
                </h3>
                <FixturesTable fixtures={matches} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </Container>
  );
};

export default CategoryPage;
