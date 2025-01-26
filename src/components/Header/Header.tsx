import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import "../Header/Header.css"

const Header: React.FC = () => {
  return (
    <Navbar expand="lg" className="bg-white shadow-sm fixed-top">
      <Container>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-center">
          <Nav className="align-items-center">
            {/* Home Link */}
            <Nav.Link as={NavLink} to="/home" end className="text-dark">
              Početna
            </Nav.Link>

            {/* 35+ Dropdown */}
            <NavDropdown title="35+" id="nav-dropdown-35" className="text-dark">
              <NavDropdown.Item as={NavLink} to="/35+/grupa-a">
                Grupa A
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/35+/grupa-b">
                Grupa B
              </NavDropdown.Item>
            </NavDropdown>

            {/* 40+ Dropdown */}
            <NavDropdown title="40+" id="nav-dropdown-40" className="text-dark">
              <NavDropdown.Item as={NavLink} to="/40+/grupa-a">
                Grupa A
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/40+/grupa-b">
                Grupa B
              </NavDropdown.Item>
            </NavDropdown>

            {/* 45+ Dropdown */}
            <NavDropdown title="45+" id="nav-dropdown-45" className="text-dark">
              <NavDropdown.Item as={NavLink} to="/45+/grupa-a">
                Grupa A
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/45+/grupa-b">
                Grupa B
              </NavDropdown.Item>
            </NavDropdown>

            {/* 50+ Dropdown */}
            <NavDropdown title="50+" id="nav-dropdown-50" className="text-dark">
              <NavDropdown.Item as={NavLink} to="/50+/grupa-a">
                Grupa A
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/50+/grupa-b">
                Grupa B
              </NavDropdown.Item>
            </NavDropdown>

            {/* 55+ Dropdown */}
            <NavDropdown title="55+" id="nav-dropdown-55" className="text-dark">
              <NavDropdown.Item as={NavLink} to="/55+/grupa-a">
                Grupa A
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/55+/grupa-b">
                Grupa B
              </NavDropdown.Item>
            </NavDropdown>

            {/* 60+ Dropdown */}
            <NavDropdown title="60+" id="nav-dropdown-60" className="text-dark">
              <NavDropdown.Item as={NavLink} to="/60+/grupa-a">
                Grupa A
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/60+/grupa-b">
                Grupa B
              </NavDropdown.Item>
            </NavDropdown>

            {/* Ž35+ Dropdown */}
            <NavDropdown title="Ž35+" id="nav-dropdown-z35" className="text-dark">
              <NavDropdown.Item as={NavLink} to="/Z35+/grupa-a">
                Grupa A
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/Z35+/grupa-b">
                Grupa B
              </NavDropdown.Item>
            </NavDropdown>

            {/* Ž45+ Dropdown */}
            <NavDropdown title="Ž45+" id="nav-dropdown-z45" className="text-dark">
              <NavDropdown.Item as={NavLink} to="/Z45+/grupa-a">
                Grupa A
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/Z45+/grupa-b">
                Grupa B
              </NavDropdown.Item>
            </NavDropdown>

            {/* Upload Link */}
            <Nav.Link as={NavLink} to="/upload" className="text-dark">
              Upload
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
