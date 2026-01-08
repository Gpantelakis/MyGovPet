import { Container, Row, Col, Card } from "react-bootstrap";
import './PetOwnerMenu.css';

const services = [
  { id: 1, title: "Στοιχεία και βιβλιάριο υγείας κατοικιδίου", steps: "2 βήματα για να δεις τα στοιχεία βιβλιαρίου" },
  { id: 2, title: "Δήλωση Απώλειας κατοικιδίου", steps: "3 βήματα για να δηλώσεις την απώλεια του κατοικιδίου" },
  { id: 3, title: "Δήλωση Εύρεσης Κατοικιδίου", steps: "3 βήματα για να δηλώσεις την εύρεση κατοικιδίου" },
  { id: 4, title: "Ιστορικό Δηλώσεων", steps: "1 βήμα για να δεις κάθε δήλωση που έχεις κάνει" },
  { id: 5, title: "Ραντεβού με Κτηνίατρο", steps: "3 βήματα για να αναζητήσεις το ραντεβού με τον κτηνίατρο που σου ταιριάζει" },
  { id: 6, title: "Αναζήτηση και Αξιολόγηση Κτηνιάτρου", steps: "3 βήματα για να αναζητήσεις ή να αξιολογήσεις κτηνίατρο" },
  { id: 7, title: "Ακύρωση Ραντεβού με Κτηνίατρο", steps: "3 βήματα για να ακυρώσεις το ραντεβού σου με κτηνίατρο" },
  { id: 8, title: "Ιστορικό των Ραντεβού με Κτηνίατρο", steps: "1 βήμα για να δεις όλα τα ραντεβού σου με τον κτηνίατρο" },
];

function PetOwnerServices() {
  return (
    <div className="pageBackGround">
      <h2 className=" text-center">Υπηρεσίες Ιδιοκτήτη Κατοικιδίου</h2>
      <Container>
        <Row xs={1} md={2} lg={4} className="g-3">
          {services.map(service => (
            <Col key={service.id}>
              <Card className="h-100 text-center p-3 service-card">
                <Card.Body>
                  <Card.Title>{service.id}. {service.title}</Card.Title>
                  <Card.Text>{service.steps}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
        {/* Footer */}
        <footer className="footerPO">
            <p>Επικοινωνία & Προσβασιμότητα</p>
            <p>Υπουργείο Ψηφιακής Διακυβέρνησης Αθήνας 1, Αθήνα</p>
            <p>Τηλέφωνο επικοινωνίας 210 111 1111</p>
            <p>Ώρες επικοινωνίας 9:00-15:00 Δευτέρα-Παρασκευή</p>
        </footer>
        

    </div>
  );
}

export default PetOwnerServices;
