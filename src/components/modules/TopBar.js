import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './TopBar.css'

function TopBar() {
  return (
    <Navbar expand="lg" className="TopBar-container">
      <Container fluid>
        <div className='button-group'>
            <Button variant="outline-success" className='Button'>Εγγραφή</Button>
            <Button variant="outline-success" className='Button'>Σύνδεση</Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default TopBar;