import { Form, Button, Row, Col } from "react-bootstrap";
import "./RegisterStep2.css";

function RegisterStep2({ formData, setFormData, onBack, onNext }) {

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="step2-container">

      {/* Step Indicator */}
      <div className="step-indicator">
        <span>Βήμα 1-Επιλογή Ρόλου</span>
        <span className="active">Βήμα 2-Δήλωση Στοιχείων</span>
        <span>Βήμα 3-Επιβεβαίωση & Ολοκλήρωση</span>
      </div>

      {/* Form */}
      <Form className="form-box">

        <Row>
          <Col md={4}>
            <Form.Label>Όνομα</Form.Label>
            <Form.Control
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Επίθετο</Form.Label>
            <Form.Control
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Τηλέφωνο</Form.Label>
            <Form.Control
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            <Form.Label>ΑΦΜ</Form.Label>
            <Form.Control
              name="afm"
              value={formData.afm}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Φύλο</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Επιλογή</option>
              <option value="male">Άνδρας</option>
              <option value="female">Γυναίκα</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label>Σπουδές (Υποχρεωτικό μόνο για γιατρούς)</Form.Label>
            <Form.Control
              name="studies"
              value={formData.studies}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            <Form.Label>Οδός Ιατρείου</Form.Label>
            <Form.Control
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Αριθμός</Form.Label>
            <Form.Control
              name="streetNumber"
              value={formData.streetNumber}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>Τ.Κ</Form.Label>
            <Form.Control
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Col>
        </Row>

      </Form>

      {/* Buttons */}
      <div className="step-buttons">
        <Button variant="success" onClick={onBack}>
          ΠΙΣΩ
        </Button>

        <Button variant="secondary" onClick={onNext}>
          ΕΠΟΜΕΝΟ
        </Button>
      </div>

    </div>
  );
}

export default RegisterStep2;
