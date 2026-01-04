import { Button, Form } from "react-bootstrap";
import "./RegisterStep1.css";

function RegisterStep1({ role, setRole, onNext }) {
  return (
    <div className="step1-container">
      <div className="step-indicator">
        <span className="active">Βήμα 1-Επιλογή Ρόλου</span>
        <span>Βήμα 2-Δήλωση Στοιχείων</span>
        <span>Βήμα 3-Επιβεβαίωση & Ολοκλήρωση</span>
      </div>

      <div className="step1-content">
        <Form>
          <Form.Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Επιλέξτε τον ρόλο σας</option>
            <option value="owner">Ιδιοκτήτης Κατοικιδίου</option>
            <option value="vet">Κτηνίατρος</option>
            <option value="citizen">Πολίτης</option>
          </Form.Select>
        </Form>
      </div>

      <div className="step1-buttons">
        <Button variant="success">ΑΡΧΙΚΗ</Button>

        <Button
          variant="secondary"
          disabled={!role}
          onClick={onNext}
        >
          ΕΠΟΜΕΝΟ
        </Button>
      </div>
    </div>
  );
}

export default RegisterStep1;
