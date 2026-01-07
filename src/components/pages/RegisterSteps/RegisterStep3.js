import {Button, Row, Col } from "react-bootstrap";
import './RegisterStep3.css'

const RegisterStep3=({ formData, onNext, onBack})=> {

    return(

        <div className="Confirm-Page">
            <div className="step-indicator">
                <span>Βήμα 1-Επιλογή Ρόλου</span>
                <span>Βήμα 2-Δήλωση Στοιχείων</span>
                <span className="active">
                Βήμα 3-Επιβεβαίωση & Ολοκλήρωση
                </span>
            </div>

            <div></div>
            <div className="confirmation-box">

                <h4>Επιβεβαίωση στοιχείων</h4>
                <div className="BeautGrid">
                    <Row className="mt-3">
                    <Col md={6}>
                        <p><strong>Όνομα:</strong> {formData.firstName}</p>
                        <p><strong>Επώνυμο:</strong> {formData.lastName}</p>
                        <p><strong>Τηλέφωνο:</strong> {formData.phone}</p>
                        <p><strong>ΑΦΜ:</strong> {formData.afm}</p>
                        <p><strong>Φύλο:</strong> {formData.gender}</p>
                        <p><strong>Σπουδές:</strong> {formData.studies}</p>
                    </Col>

                    <Col md={6}>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Οδός Ιατρείου:</strong> {formData.street}</p>
                        <p><strong>Αριθμός Ιατρείου:</strong> {formData.streetNumber}</p>
                        <p><strong>Τ.Κ Ιατρείου:</strong> {formData.postalCode}</p>
                    </Col>
                    </Row>
                </div>
            </div>
            <div className="step-buttons">
                <Button variant="secondary" onClick={onBack}>
                ΠΙΣΩ
                </Button>

                <Button variant="success" className="ConfirmButton" onClick={onNext}>
                ΕΠΙΒΕΒΑΙΩΣΗ
                </Button>
            </div>
        </div>



    )
}

export default RegisterStep3