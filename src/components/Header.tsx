import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import "../components/Header.css"

const Header: React.FC = () => {
  return (
    <Navbar expand="lg" className="bg-white shadow-sm fixed-top">
      <Container>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-center">
          <Nav className="align-items-center">
            <Nav.Link as={NavLink} to="/home" end className="text-dark">
              Početna
            </Nav.Link>
            <Nav.Link as={NavLink} to="/u15" className="text-dark">
              U15
            </Nav.Link>
            <Nav.Link as={NavLink} to="/u17" className="text-dark">
              U17
            </Nav.Link>
            <Nav.Link as={NavLink} to="/u19" className="text-dark">
              U19
            </Nav.Link>
            <Nav.Link as={NavLink} to="/u21" className="text-dark">
              U21
            </Nav.Link>
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
