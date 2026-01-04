import { Modal, Button, Form } from 'react-bootstrap';
import './Login.css';


function LoginModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered className="login-modal">
      <Modal.Header closeButton>
        <Modal.Title>PetCare.gr</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Κωδικός</Form.Label>
                <Form.Control type="password" />
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
