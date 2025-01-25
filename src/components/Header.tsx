import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          React-Bootstrap
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/u15">
              U15
            </Nav.Link>
            <Nav.Link as={NavLink} to="/u17">
              U17
            </Nav.Link>
            <Nav.Link as={NavLink} to="/u19">
              U19
            </Nav.Link>
            <Nav.Link as={NavLink} to="/u21">
              U21
            </Nav.Link>
            <Nav.Link as={NavLink} to="/upload">
              Upload
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
