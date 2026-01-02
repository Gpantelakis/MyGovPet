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
            </Form.Group>

            <div className="GroupButtons">
            <Button type="submit" className="w-100">
            Σύνδεση
            </Button>

            <Button type="submit" className="w-100">
            Εγγραφή
            </Button>
            </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
