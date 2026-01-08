import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './TopBar.css'
import { useEffect,useState } from 'react';
import Login from '../pages/Login';
import { useNavigate } from 'react-router-dom';

const TopBar =() => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetch(`http://localhost:3001/users/${userId}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser(null));
    }
  }, [showLogin]);

  function handleLogout() {
    localStorage.clear();
    setUser(null);
    window.location.href = "/Home";
  }
  
  return (
    <>
    <Navbar expand="lg" className="TopBar-container">
      <Container fluid>
        <div className='button-group'>
             {user ? (
              <>
                <span className="welcome-text">
                  Καλώς ήρθες, <strong>{user.firstName}</strong>
                </span>

                <Button
                  variant="outline-danger"
                  className="Button"
                  onClick={handleLogout}
                >
                  Αποσύνδεση
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline-success"
                  className="Button"
                  onClick={() => navigate("/register")}
                >
                  Εγγραφή
                </Button>

                <Button
                  variant="outline-success"
                  className="Button"
                  onClick={() => setShowLogin(true)}
                >
                  Σύνδεση
                </Button>
              </>
            )}
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