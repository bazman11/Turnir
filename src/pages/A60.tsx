import React from "react";
import "./css/U15.css";

const A60: React.FC = () => {
  return (
    <div className="container mt-4">
        <div className="header-container mb-4">
        <h1 className="kategorija">Kategorija: Muškarci 60+</h1>
        <h2 className="grupa">Grupa: A</h2>
      </div>
      <div className="row g-4">
        {/* Fixtures Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center">
              <h5 className="mb-0">Fixtures</h5>
            </div>
            <div className="card-body">
              <p className="text-muted text-center">No fixtures available.</p>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center">
              <h5 className="mb-0">Leaderboard</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="team-name">Team A</span>
                    <span className="badge bg-primary rounded-pill">15 Points</span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="team-name">Team B</span>
                    <span className="badge bg-secondary rounded-pill">12 Points</span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="team-name">Team C</span>
                    <span className="badge bg-info rounded-pill">9 Points</span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="team-name">Team D</span>
                    <span className="badge bg-warning rounded-pill">6 Points</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default A60;
