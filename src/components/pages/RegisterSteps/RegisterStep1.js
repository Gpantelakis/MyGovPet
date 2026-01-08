import { Button, Form } from "react-bootstrap";
import "./RegisterStep1.css";


const roles = [
  { id: 1, label: "Ιδιοκτήτης Κατοικιδίου", value: "owner" },
  { id: 2, label: "Κτηνίατρος", value: "vet" },
  { id: 3, label: "Πολίτης", value: "citizen" }
];
function RegisterStep1({ role, setRole,setFormData, onNext }) {
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
            value={role}   // μπορεί να κρατάει το id ή το value
            onChange={(e) => {
            const selectedId = Number(e.target.value); // παίρνουμε τον αριθμό
            const selectedRole = roles.find(r => r.id === selectedId);
            setRole(selectedId); // κρατάμε τον αριθμό
            setFormData(prev => ({
              ...prev,
              role: selectedRole.id // ή id, ανάλογα τι θέλεις να στείλεις στο backend
    }));
  }}
>
  <option value="">Επιλέξτε τον ρόλο σας</option>
  {roles.map(r => (
    <option key={r.id} value={r.id}>
      {r.label}
    </option>
  ))}
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
