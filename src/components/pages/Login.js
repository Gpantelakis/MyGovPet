import { Modal, Button, Form } from 'react-bootstrap';
import './Login.css';
import { useState } from 'react';


function LoginModal({ show, handleClose }) {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
  e.preventDefault();

  fetch(`http://localhost:3001/users?email=${email}&password=${password}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Server error");
      }
      return res.json();
    })
    .then(users => {
      if (!Array.isArray(users)) {
        throw new Error("Invalid response");
      }

      if (users.length === 0) {
        alert("Λάθος email ή κωδικός");
        return;
      }

      localStorage.setItem("userId", users[0].id);
      alert("Σύνδεση επιτυχής!");
      handleClose();
      window.location.href = "/Home";
    })
    .catch(err => {
      console.error("LOGIN ERROR:", err);
      alert("Σφάλμα σύνδεσης");
    });
};
  
  return (
    <Modal show={show} onHide={handleClose} centered className="login-modal">
      <Modal.Header closeButton>
        <Modal.Title>PetCare.gr</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Κωδικός</Form.Label>
                <Form.Control type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
                <p className="password-hint">Ο κωδικός πρόσβασης πρέπει να αποτελείται από τουλάχιστον 8 χαρακτήρες και να περιλαμβάνει κεφαλαία γράμματα, αριθμούς και ειδικά σύμβολα (π.χ. !, @, #, $).</p>
            </Form.Group>

            <div className="GroupButtons">
            <Button type="submit" className="w-100">
            Σύνδεση
            </Button>

            <Button type="submit" className="w-100">
            Εγγραφή
            </Button>
            </div>

            <div className="loginGuest">
              <a href='/guest'> Συνέχισε χωρίς εγγραφή(Αναζήτηση/Δήλωση απώλεσθέντος κατοικδίου) 
              </a>
            </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
