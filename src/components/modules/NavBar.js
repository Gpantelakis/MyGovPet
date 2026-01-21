import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './NavBar.css'
import {Link, useNavigate}  from "react-router-dom";



function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="NavBar-container">
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            src="/gov.svg"
            alt="Logo"
            className="logo" 
            onClick={() => navigate("/Home")}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="mx-auto my-2 my-lg-0 nav center"
            style={{ maxHeight: 'none' }}
            navbarScroll
          >
            <NavDropdown title="Ιδιοκτήτες Κατοικιδίων" id="navbarScrollingDropdown-PetOwn">
                
              <NavDropdown.Item onClick={() => navigate("/PetOwnerMenu/service/1")}>Στοιχεία κατοικιδίου</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/PetOwnerMenu/service/2")}>Δήλωση απώλειας κατοικιδίου</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/PetOwnerMenu/service/3")}>Δήλωση εύρεσης κατοικιδίου</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/PetOwnerMenu/service/4")}>Ιστορικό Δηλώσεων</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/PetOwnerMenu/service/5")}>Ραντεβού με κτηνίατρο</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/PetOwnerMenu/service/6")}>Αναζήτηση και Αξιολόγηση Κτηνιάτρου</NavDropdown.Item>
              <NavDropdown.Item href="#cancelAp">Ακύρωση Ραντεβού με κτηνίατρο</NavDropdown.Item>
              <NavDropdown.Item href="#HistoryAp">Ιστορικό των Ραντεβού</NavDropdown.Item>

            </NavDropdown>

            <NavDropdown title="Κτηνίατρος" id="navbarScrollingDropdown-Vet">
              <NavDropdown.Item href="#cr_Prof">Δημιουργία Προφίλ</NavDropdown.Item>
              <NavDropdown.Item href="#pet_check">Καταγραφή ταυτότητας και συμβάντων κατοικιδίου</NavDropdown.Item>
              <NavDropdown.Item href="#med_action">Καταγραφή Ιατρικών Πράξεων</NavDropdown.Item>
              <NavDropdown.Item href="#History_med">Ιστορικό Επισκέψεων και Ιατρικών Πράξεων</NavDropdown.Item>
              <NavDropdown.Item href="#Avail_set">Ρυθμίστε τις διαθεσιμότητά σας</NavDropdown.Item>
              <NavDropdown.Item href="#Check_ap">Δείτε τα ραντεβού σας</NavDropdown.Item>
              <NavDropdown.Item href="#History_rate">Ιστορικό Αξιολογήσεων</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Πολίτες" id="navbarScrollingDropdown-Citizen">
              <NavDropdown.Item href="#lost_pet_plat">Πλατφόρμα απολεσθέντων κατοικιδίων</NavDropdown.Item>
              <NavDropdown.Item href="#find_pet_ci">Εύρεση κατοικιδίου</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;