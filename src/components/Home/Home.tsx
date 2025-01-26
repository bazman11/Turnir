import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="first-page-container d-flex">
      {/* Left Section */}
      <div className="left-section bg-light text-dark p-4 rounded shadow">
        <h1 className="mb-3 text-center">4. Sarajevo Hills Basket Turnir</h1>
        <h3 className="text-warning text-center">21.02. - 23.02.2025</h3>

        <div className="mt-4">
          <h4 className="text-uppercase text-center">Kategorije</h4>
          <p className="text-center">
            <strong>M:</strong> 35+, 40+, 45+, 50+, 55+, 60+ <br />
            <strong>Ž:</strong> 35+, 45+
          </p>
        </div>

        <div className="mt-4">
          <h4 className="text-uppercase text-center">Kontakt:</h4>
          <ul className="list-unstyled text-center">
            <li>
              <strong>FB:</strong> Sarajevo Hills Basket
            </li>
            <li>
              <strong>Viber:</strong> +387 63 894 326
            </li>
            <li>
              <strong>Mail:</strong>{" "}
              <a
                href="mailto:sarajevohillsbasket@gmail.com"
                className="text-warning"
              >
                sarajevohillsbasket@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section flex-grow-1 p-4 text-center d-flex flex-column justify-content-center align-items-center">
        <p>
          Zainteresovani za rezultate? Provjerite stanje na tabeli i saznajte
          kako vaš omiljeni tim stoji na turniru.
        </p>
        <button className="btn btn-primary mt-3">
          <Link to="/u15" className="text-white text-decoration-none">
            Pogledaj tabelu
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
