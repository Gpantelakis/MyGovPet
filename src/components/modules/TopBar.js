import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './TopBar.css'
import { useState } from 'react';
import Login from '../pages/Login';

function TopBar() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
    <Navbar expand="lg" className="TopBar-container">
      <Container fluid>
        <div className='button-group'>
            <Button variant="outline-success" className='Button'>Εγγραφή</Button>
            <Button
              variant="outline-success"
              className="Button"
              onClick={() => setShowLogin(true)}
            >
              Σύνδεση
            </Button>
        </div>
      </Container>
    </Navbar>

    <Login
        show={showLogin}
        handleClose={() => setShowLogin(false)}
      />
    </>
  );
}

export default TopBar;