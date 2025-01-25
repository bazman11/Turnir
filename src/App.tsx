import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./pages/Home";
import U15 from "./pages/U15";
import U17 from "./pages/U17";
import U19 from "./pages/U19";
import U21 from "./pages/U21";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/u15" element={<U15 />} />
        <Route path="/u17" element={<U17 />} />
        <Route path="/u19" element={<U19 />} />
        <Route path="/u21" element={<U21 />} />
      </Routes>
    </Router>
  );
};

export default App;
