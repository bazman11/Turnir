import React from "react";
import "./css/Home.css";

const Home: React.FC = () => {
  return (
    <div className="first-page-container d-flex">
      {/* Left Section */}
      <div className="left-section flex-grow-1 p-4">
        <h1>About the Tournament</h1>
        <p>
          Welcome to our annual tournament! Experience competitive gameplay,
          sportsmanship, and exciting prizes. Join us and be part of the
          action-packed event of the year.
        </p>
      </div>

      {/* Right Section */}
      <div className="right-section flex-grow-1 p-4 text-center d-flex flex-column justify-content-center align-items-center">
        <p>
          Curious about the results?{" "}
          <a href="#" className="leaderboard-link text-primary">
            Click here for leaderboards
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
