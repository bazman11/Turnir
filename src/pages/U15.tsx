import React from "react";

const U15: React.FC = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Fixtures</h5>
            </div>
            <div className="card-body">
              <div className="fixture mb-3">
                <p className="mb-1">
                  <strong>Team A vs Team B</strong>
                </p>
                <p className="mb-1">Date: January 25, 2025</p>
                <p>Time: 6:00 PM</p>
              </div>
              <hr />
              <div className="fixture mb-3">
                <p className="mb-1">
                  <strong>Team C vs Team D</strong>
                </p>
                <p className="mb-1">Date: January 26, 2025</p>
                <p>Time: 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Leaderboard</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Team A
                  <span className="badge bg-primary rounded-pill">
                    15 Points
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Team B
                  <span className="badge bg-secondary rounded-pill">
                    12 Points
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Team C
                  <span className="badge bg-info rounded-pill">9 Points</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Team D
                  <span className="badge bg-warning rounded-pill">
                    6 Points
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default U15;
