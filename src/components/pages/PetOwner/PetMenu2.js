import { useState } from "react";
import { useEffect,useRef } from "react";
import { Button } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import './PetMenu2.css'
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";



function PetMenu2({userId},onNext) {
  const [user, setUser] = useState(null);
  const [chipNumber, setChipNumber] = useState("");
  const [pet, setPet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [PetMenu1step,setPetMenu1step]=useState(1)
  const [selectedPet,setSelectedPet]=useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formError, setFormError] = useState("");
 
    // Refs για τα πεδία που θα ελέγχονται πριν εκτύπωση
  const lostDateRef = useRef();
  const locationLostRef = useRef();
  const lostemailRef = useRef();
  const lostphoneRef = useRef();
  const fileInputRef = useRef();
  const navigate = useNavigate();

  //πεδία για φόρμα
  const [LostData, setLostData] = useState({
  chipNumber:"",
  LostDate: "",
  LocationLost: "",
  phone: "",
  ownerName: "",
  petName: "",
  birthDate: "",
  Lostcomments: "",
  streetNumber: "",
  email: "",
  photo:""
});

useEffect(() => {
  if (user && selectedPet) {
    setLostData(prev => ({
      ...prev,
      chipNumber: selectedPet.chipNumber,
      petName: selectedPet.name,
      birthDate: selectedPet.BirthDate,
      ownerName: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      email: user.email,
      streetNumber: user.streetNumber,
      photo:selectedPet.photo,
      
    }));
  }
}, [user, selectedPet]);
  
    const LosthandleChange = (e) => {
      const { name, value, files } = e.target;

        if (files && files[0]) {
          // Αν είναι input τύπου file
          setLostData(prev => ({
            ...prev,
            [name]: URL.createObjectURL(files[0])
          }));
        } else {
          // Κανονικό update για text, date, textarea
          setLostData(prev => ({
            ...prev,
            [name]: value
          }));
        }
    };  

  useEffect(() => {
    fetch(`http://localhost:3001/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

 const searchPet = async () => {
    if (!user) return;

    setLoading(true);
    setPet([]);

    try {
      console.log(chipNumber);
      const url =
      chipNumber.trim() === ""
        ? `http://localhost:3001/pets?ownerAfm=${user.afm}`
        : `http://localhost:3001/pets?ownerAfm=${user.afm}&chipNumber=${chipNumber}`;
          const res = await fetch(url);
      
      const data = await res.json();
      if (data.length > 0) setPet(data);
      else setPet([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateStep2 = () => {
    setFormError("");
  if (
    !LostData.LostDate ||
    !LostData.LocationLost ||
    !LostData.phone ||
    !LostData.email ||
    !LostData.Lostcomments ||
    !LostData.photo
  ) {
    setFormError("Παρακαλώ συμπληρώστε όλα τα στοιχεία");
    return false;
  }

  setFormError("");
  return true;
};

  const LosthandleSubmit = async () => {
  setIsSubmitting(true);
  setSubmitError(false);
  const startTime = Date.now();


  try {
    const response = await fetch("http://localhost:3001/lostPets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...LostData,
        createdAt: new Date().toISOString(),
        userId:localStorage.getItem('userId'),
        status: "active",
      }),
    });

    if (!response.ok) throw new Error("Submit failed");

    console.log(`http://localhost:3001/pets/${Number(selectedPetId)}`)
    const petResponse = await fetch(
      `http://localhost:3001/pets/${Number(selectedPetId)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lost: true }),
      }
    );

    if (!petResponse.ok) throw new Error("Pet update failed");
      const elapsed = Date.now() - startTime;
      const minDelay = 2000;

    if (elapsed < minDelay) {
      await new Promise(res => setTimeout(res, minDelay - elapsed));
    }

    setSubmitSuccess(true);
  } catch (error) {
    setSubmitError(true);
  } finally {
    setIsSubmitting(false);
  }
  };

  if (!user) return <p>Φόρτωση στοιχείων χρήστη...</p>;
  

 return (

<>
  <div className="main-container">

    {/* Parent div περιέχει όλα τα steps */}
    {PetMenu1step === 1 && (
      <div>

        {/*Step Indicator */}
        <div className="u-step-indicator">
          <span className="active">Δήλωση απώλειας κατοικιδίου</span>
            <span className="active">&gt; Επιλογή Κατοικιδίου</span>
            <span>&gt; Συμπλήρωση Στοιχείων</span>
            <span>&gt; Προεπισκόπηση & Υποβολή</span>
        </div>

        <div className="SearchTool">
          <h2>Αναζήτηση Κατοικιδίου</h2>
          <input 
            type="text"
            placeholder="Εισάγετε τον αριθμό μικροτσίπ"
            value={chipNumber}
            onChange={e => setChipNumber(e.target.value)}
          />
          <button onClick={searchPet} disabled={loading}>
            {loading ? "Αναζήτηση..." : "ΑΝΑΖΗΤΗΣΗ"}
          </button>
        </div>

        <div className="pet-cards">
          {pet.length > 0 ? (
            pet.map(p => (
              <label
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  border: selectedPetId === p.id ? "2px solid #0d6efd" : "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "12px",
                  margin: "12px 0",
                  cursor: "pointer",
                  background: selectedPetId === p.id ? "#f0f6ff" : "#fff"
                }}
              >
                <input
                  type="radio"
                  name="selectedPet"
                  checked={selectedPetId === p.id}
                  disabled={p.lost}
                  onChange={() => {setSelectedPetId(p.id)
                                  setSelectedPet(p)
                  }}
                />
                <img
                  src={p.photo}
                  alt={p.name}
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd"
                  }}
                />
                <div>
                  <h5 style={{ margin: 0 }}>{p.name} {p.lost ? "(Χαμένο)" : ""}</h5>
                  <p style={{ margin: "4px 0" }}>Ζώο: {p.type}</p>
                  <p style={{ margin: 0 }}>Μικροτσίπ: {p.chipNumber}</p>
                </div>
              </label>
            ))
          ) : (
            <p>Δεν βρέθηκαν κατοικίδια.</p>
          )}
        </div>

        <div className="u-buttons">
          <Button variant="success" onClick={()=>navigate("/PetOwnerMenu")}>Υπηρεσίες</Button>
          <Button
            variant="secondary"
            onClick={() => selectedPetId && setPetMenu1step(2)}
          >
            ΕΠΟΜΕΝΟ
          </Button>
        </div>
      </div>
    )}

    {PetMenu1step === 2 && selectedPetId && (
      <div className="Step2">

          {/*Step Indicator */}
          <div className="u-step-indicator" >
            <span className="active">Δήλωση απώλειας κατοικιδίου</span>
            <span className="active">&gt; Επιλογή Κατοικιδίου</span>
            <span className="active">&gt; Συμπλήρωση Στοιχείων</span>
            <span>&gt; Προεπισκόπηση & Υποβολή</span>
          </div>

          <h2 style={{textAlign:"center"}}>Δήλωση απώλειας κατοικιδίου</h2>
          <div className="Lost-Form">
            
            <Row>
            <Col md={4}>
              <Form.Label>Μικροτσίπ</Form.Label>
              <Form.Control name="Microchip" value={selectedPet.chipNumber} readOnly style={{backgroundColor:"#e0e0e0"}}/>
            </Col>

            <Col md={4}>
              <Form.Label>Ημερομηνία εξαφάνισης</Form.Label>
              <Form.Control name="LostDate" ref={lostDateRef} type="date" onChange={LosthandleChange}/>
            </Col>

          <Col md={4}>
              <Form.Label>Τοποθεσία εξαφάνισης</Form.Label>
              <Form.Control name="LocationLost" value={LostData.LocationLost} ref={locationLostRef} onChange={LosthandleChange}/>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Label>Ονοματεπώνυμο Ιδιοκτήτη</Form.Label>
              
              <Form.Control name="Ownername" value={LostData.ownerName} readOnly style={{backgroundColor:"#e0e0e0"}}/>
            </Col>

            <Col md={4}>
              <Form.Label>Τηλέφωνο</Form.Label>
              <Form.Control name="phone" ref={lostphoneRef} value={LostData.phone} onChange={LosthandleChange} />
            </Col>

          <Col md={4}>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" ref={lostemailRef} value={LostData.email} onChange={LosthandleChange}/>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Label>Ονοματεπώνυμο Κατοικιδίου</Form.Label>
              <Form.Control name="petname" value={selectedPet.name} readOnly style={{backgroundColor:"#e0e0e0"}}/>
            </Col>

            <Col md={4}>
              <Form.Label>Ημερομηνία Γέννησης Κατοικιδίου</Form.Label>
              <Form.Control name="BirthDate" value={selectedPet.BirthDate} type="date" readOnly style={{backgroundColor:"#e0e0e0"}}/>
            </Col>

            <Col md={4}>
              <Form.Label>Σχόλια</Form.Label>
              <Form.Control name="Lostcomments" as="textarea" value={LostData.Lostcomments} onChange={LosthandleChange}/>
            </Col>

          </Row>
          <Row>
            <Col md={4}>
              <Form.Label>Φωτογραφία</Form.Label>
              <div className="lost-photo-uploader">
                {/* Κρυφό input τύπου file */}
                <input
                  name="photo"
                  id="fileInput"
                  type="file"
                  accept="image/*"
                   ref={fileInputRef}
                  onChange={LosthandleChange}
                  style={{ display: "none" }}
                />

                {/* Προεπισκόπηση με double-click για αλλαγή */}
                <img
                  src={LostData.photo || "https://via.placeholder.com/200x200?text=Προεπισκόπηση"}
                  alt="Προεπισκόπηση"
                  className="Lost-Photo"
                  onDoubleClick={() => fileInputRef.current.click()}
                />
              </div>
            </Col>
          </Row>
        </div>
        
        <div className="u-buttons">
          <Button className="no-print" variant="secondary" onClick={() => setPetMenu1step(1)}>Πίσω</Button>
          {formError && <p className="error-text">{formError}</p>}
          <Button variant="success" onClick={() => { if (validateStep2()) {setPetMenu1step(3);}}}>Προεπισκόπηση</Button>
        </div>
      </div>
      
    )}
    {PetMenu1step === 3 && (
  <div className="Step3">
    <div className="u-step-indicator">
      <span className="active">Δήλωση απώλειας κατοικιδίου</span>
      <span className="active">&gt; Επιλογή Κατοικιδίου</span>
      <span className="active">&gt; Συμπλήρωση Στοιχείων</span>
      <span className="active">&gt; Προεπισκόπηση & Υποβολή</span>
    </div>

    <h2 style={{textAlign:"center"}}>Προεπισκόπηση Δήλωσης</h2>
    <div className="Lost-Form-Submit-container">
      <div className="Lost-Form-Submit-text">
        <Row className="u-green-line" >
          <Col md={8}>
            <p><strong>Μικροτσίπ:</strong> {LostData.chipNumber}</p>
          </Col>
          <Col md={8}>
            <p><strong>Ονοματεπώνυμο Κατοικιδίου:</strong> {LostData.petName}</p>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <p><strong>Ονοματεπώνυμο Ιδιοκτήτη:</strong> {LostData.ownerName}</p>
          </Col>
          <Col md={8}>
            <p><strong>Τηλέφωνο:</strong> {LostData.phone}</p>
          </Col>
          
        </Row>

        <Row className="u-green-line"  >
          <Col md={8}>
            <p><strong>Email:</strong> {LostData.email}</p>
          </Col>
          <Col md={8}>
            <p><strong>Ημερομηνία Γέννησης Κατοικιδίου:</strong> {LostData.birthDate}</p>
          </Col>
        </Row>

        <Row>
          
          <Col md={8}>
            <p><strong>Ημερομηνία Εξαφάνισης:</strong> {LostData.LostDate}</p>
          </Col>
          <Col md={8}>
            <p><strong>Τοποθεσία Εξαφάνισης:</strong> {LostData.LocationLost}</p>
          </Col>
          
        </Row>

        <Row className="u-green-line" >
          <Col md={8}>
            <p className="preview-textarea"><strong>Σχόλια:</strong> {LostData.Lostcomments}</p>
          </Col>
        </Row>
      </div>

        <img
          src={LostData.photo || "https://via.placeholder.com/200x200?text=Προεπισκόπηση"}
          alt="Προεπισκόπηση"
          className="Lost-Photo"
        />
    </div>

    <div className="u-buttons">
      <Button variant="secondary"  onClick={() => {if (submitSuccess) { navigate("/PetOwnerMenu");  } else {setPetMenu1step(2);}}}>{submitSuccess ? "Υπηρεσίες" : "Πίσω"}</Button>

      <Button
  variant="success"
  onClick={LosthandleSubmit}
  disabled={isSubmitting || submitSuccess}
>
            {isSubmitting ? (
              <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: "8px" }}
              />
                Καταχώρηση...
              </>
            ) : submitSuccess ? (
              " Καταχωρήθηκε"
            ) : (
              "Υποβολή"
            )}
</Button>
      {submitError && (
        <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          Κάτι πήγε στραβά. Προσπαθήστε ξανά.
        </p>
      )}
    </div>
  </div>
)}
  </div>
  {/* Footer */}
  <footer className="footerPO">
  <p>Επικοινωνία & Προσβασιμότητα</p>
  <p>Υπουργείο Ψηφιακής Διακυβέρνησης Αθήνας 1, Αθήνα</p>
  <p>Τηλέφωνο επικοινωνίας 210 111 1111</p>
  <p>Ώρες επικοινωνίας 9:00-15:00 Δευτέρα-Παρασκευή</p>
  </footer>
  </>
);

}

export default PetMenu2;
