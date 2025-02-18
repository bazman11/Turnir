import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import "../Header/Header.css";

const Header: React.FC = () => {
  return (
    <Navbar expand="lg" className="bg-white shadow-sm fixed-top">
      <Container>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-center">
          <Nav className="align-items-center">
            {/* Home Link */}
            <Nav.Link as={NavLink} to="/" end className="text-dark">
              Početna
            </Nav.Link>

            {/* Age Group Links */}
            <Nav.Link as={NavLink} to="/M35" className="text-dark">
              35+
            </Nav.Link>
            <Nav.Link as={NavLink} to="/M40" className="text-dark">
              40+
            </Nav.Link>
            <Nav.Link as={NavLink} to="/M45" className="text-dark">
              45+
            </Nav.Link>
            <Nav.Link as={NavLink} to="/M50" className="text-dark">
              50+
            </Nav.Link>
            <Nav.Link as={NavLink} to="/M55" className="text-dark">
              55+
            </Nav.Link>
            <Nav.Link as={NavLink} to="/M60" className="text-dark">
              60+
            </Nav.Link>

            {/* Women's Categories */}
            <Nav.Link as={NavLink} to="/Z35" className="text-dark">
              Ž35+
            </Nav.Link>
            <Nav.Link as={NavLink} to="/Z40" className="text-dark">
              Ž40+
            </Nav.Link>
            <Nav.Link as={NavLink} to="/Z45" className="text-dark">
              Ž45+
            </Nav.Link>

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
