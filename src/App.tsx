import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Upload from "./pages/Upload";
import Home from "./components/Home/Home";
import U15 from "./pages/A35";
import U17 from "./pages/B35";
import U19 from "./pages/A40";
import U21 from "./pages/B40";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/u15" element={<U15 />} />
        <Route path="/u17" element={<U17 />} />
        <Route path="/u19" element={<U19 />} />
        <Route path="/u21" element={<U21 />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
};

export default App;
