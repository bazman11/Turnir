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

        {/* Google Maps Embed */}
        <div className="mt-4">
          <h4 className="text-uppercase text-center">Lokacija: Hotel Hills</h4>
          <div className="d-flex justify-content-center">
            <iframe
              title="Hotel Hills Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2870.8432367368824!2d18.3109675!3d43.8269694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4758ca169229ade1%3A0x7e4caf7bf4a147d4!2sHotel%20Hills!5e0!3m2!1sen!2sba!4v1698742948302!5m2!1sen!2sba"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "10px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section flex-grow-1 p-4 text-center d-flex flex-column justify-content-center align-items-center">
        <p>
          Zainteresovani za rezultate? Provjerite stanje na tabeli i saznajte
          kako vaš omiljeni tim stoji na turniru.
        </p>
        <button className="btn btn-primary mt-3">
          <Link to="/35+/grupa-a" className="text-white text-decoration-none">
            Pogledaj tabelu
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
