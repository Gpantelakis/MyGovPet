import { useState } from "react";
import { useEffect,useRef } from "react";
import { Button } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import './PetMenu3.css'
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";



function PetMenu3({userId}) {
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
  const FindDateRef = useRef();
  const locationFindRef = useRef();
  const FindemailRef = useRef();
  const FindphoneRef = useRef();
  const fileInputRef = useRef();
  const navigate = useNavigate();

  //πεδία για φόρμα
  const [FindData, setFindData] = useState({
  chipNumber:"",
  FindDate: "",
  LocationFind: "",
  phone: "",
  ownerName: "",
  petName: "",
  birthDate: "",
  Findcomments: "",
  streetNumber: "",
  email: "",
  photo:""
});

useEffect(() => {
  if (user && selectedPet) {
    setFindData(prev => ({
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
  
    const FindhandleChange = (e) => {
      const { name, value, files } = e.target;

        if (files && files[0]) {
          // Αν είναι input τύπου file
          setFindData(prev => ({
            ...prev,
            [name]: URL.createObjectURL(files[0])
          }));
        } else {
          // Κανονικό update για text, date, textarea
          setFindData(prev => ({
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
  if (
    !FindData.FindDate ||
    !FindData.LocationFind ||
    !FindData.phone ||
    !FindData.email ||
    !FindData.Findcomments ||
    !FindData.photo
  ) {
    setFormError("Παρακαλώ συμπληρώστε όλα τα στοιχεία");
    alert(formError)
    return false;
  }

  setFormError("");
  return true;
};

  const FindhandleSubmit = async () => {
  setIsSubmitting(true);
  setSubmitError(false);
  const startTime = Date.now();

  try {
    const response = await fetch("http://localhost:3001/FindPets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...FindData,
        createdAt: new Date().toISOString(),
        userId:localStorage.getItem('userId')
      }),
    });

    if (!response.ok) throw new Error("Submit failed");

    const petResponse = await fetch(
      `http://localhost:3001/pets/${Number(selectedPetId)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lost: false }),
      }
    );
    
    if (!petResponse.ok) throw new Error("Update Pet failed");

    const getResponse = await fetch(`http://localhost:3001/lostPets?chipNumber=${selectedPet.chipNumber}&status=active`);
    const lostPets = await getResponse.json();

    if (lostPets.length === 0) {
      console.log("Δεν υπάρχει lostPet με αυτό το chipNumber");
      return;
    }

    const lostPetId = lostPets[0].id;
    const LostPetResponse=await fetch(`http://localhost:3001/lostPets/${lostPetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "inactive" }),
    });

    if (!LostPetResponse.ok) throw new Error("Update Pet failed");

      
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
          <span className="active">Δήλωση Εύρεσης κατοικιδίου</span>
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
                  disabled={!p.lost}
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
            <span className="active">Δήλωση Εύρεσης κατοικιδίου</span>
            <span className="active">&gt; Επιλογή Κατοικιδίου</span>
            <span className="active">&gt; Συμπλήρωση Στοιχείων</span>
            <span>&gt; Προεπισκόπηση & Υποβολή</span>
          </div>

          <h2 style={{textAlign:"center"}}>Δήλωση Εύρεσης κατοικιδίου</h2>
          <div className="Find-Form">
            
            <Row>
            <Col md={4}>
              <Form.Label>Μικροτσίπ</Form.Label>
              <Form.Control name="Microchip" value={selectedPet.chipNumber} readOnly style={{backgroundColor:"#e0e0e0"}}/>
            </Col>

            <Col md={4}>
              <Form.Label>Ημερομηνία εύρεσης</Form.Label>
              <Form.Control name="FindDate" ref={FindDateRef} type="date" onChange={FindhandleChange}/>
            </Col>

          <Col md={4}>
              <Form.Label>Τοποθεσία εύρεσης</Form.Label>
              <Form.Control name="LocationFind" value={FindData.LocationFind} ref={locationFindRef} onChange={FindhandleChange}/>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Label>Ονοματεπώνυμο Ιδιοκτήτη</Form.Label>
              
              <Form.Control name="Ownername" value={FindData.ownerName} readOnly style={{backgroundColor:"#e0e0e0"}}/>
            </Col>

            <Col md={4}>
              <Form.Label>Τηλέφωνο</Form.Label>
              <Form.Control name="phone" ref={FindphoneRef} value={FindData.phone} onChange={FindhandleChange} />
            </Col>

          <Col md={4}>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" ref={FindemailRef} value={FindData.email} onChange={FindhandleChange}/>
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
              <Form.Control name="Findcomments" as="textarea" value={FindData.Findcomments} onChange={FindhandleChange}/>
            </Col>

          </Row>
          <Row>
            <Col md={4}>
              <Form.Label>Φωτογραφία</Form.Label>
              <div className="Find-photo-uploader">
                {/* Κρυφό input τύπου file */}
                <input
                  name="photo"
                  id="fileInput"
                  type="file"
                  accept="image/*"
                   ref={fileInputRef}
                  onChange={FindhandleChange}
                  style={{ display: "none" }}
                />

                {/* Προεπισκόπηση με double-click για αλλαγή */}
                <img
                  src={FindData.photo || "https://via.placeholder.com/200x200?text=Προεπισκόπηση"}
                  alt="Προεπισκόπηση"
                  className="Find-Photo"
                  onDoubleClick={() => fileInputRef.current.click()}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className="u-buttons">
          <Button className="no-print" variant="secondary" onClick={() => setPetMenu1step(1)}>Πίσω</Button>

          <Button variant="success" onClick={() => { if (validateStep2()) {setPetMenu1step(3);}}}>Προεπισκόπηση</Button>
        </div>
      </div>
      
    )}
    {PetMenu1step === 3 && (
  <div className="Step3">
    <div className="u-step-indicator">
      <span className="active">Δήλωση Εύρεσης κατοικιδίου</span>
      <span className="active">&gt; Επιλογή Κατοικιδίου</span>
      <span className="active">&gt; Συμπλήρωση Στοιχείων</span>
      <span className="active">&gt; Προεπισκόπηση & Υποβολή</span>
    </div>

    <h2 style={{textAlign:"center"}}>Προεπισκόπηση Δήλωσης</h2>
    <div className="Find-Form-Submit-container">
      <div className="Find-Form-Submit-text">
        <Row className="u-green-line" >
          <Col md={8}>
            <p><strong>Μικροτσίπ:</strong> {FindData.chipNumber}</p>
          </Col>
          <Col md={8}>
            <p><strong>Ονοματεπώνυμο Κατοικιδίου:</strong> {FindData.petName}</p>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <p><strong>Ονοματεπώνυμο Ιδιοκτήτη:</strong> {FindData.ownerName}</p>
          </Col>
          <Col md={8}>
            <p><strong>Τηλέφωνο:</strong> {FindData.phone}</p>
          </Col>
          
        </Row>

        <Row className="u-green-line"  >
          <Col md={8}>
            <p><strong>Email:</strong> {FindData.email}</p>
          </Col>
          <Col md={8}>
            <p><strong>Ημερομηνία Γέννησης Κατοικιδίου:</strong> {FindData.birthDate}</p>
          </Col>
        </Row>

        <Row>
          
          <Col md={8}>
            <p><strong>Ημερομηνία εύρεσης:</strong> {FindData.FindDate}</p>
          </Col>
          <Col md={8}>
            <p><strong>Τοποθεσία εύρεσης:</strong> {FindData.LocationFind}</p>
          </Col>
          
        </Row>

        <Row className="u-green-line" >
          <Col md={8}>
            <p className="preview-textarea"><strong>Σχόλια:</strong> {FindData.Findcomments}</p>
          </Col>
        </Row>
      </div>

        <img
          src={FindData.photo || "https://via.placeholder.com/200x200?text=Προεπισκόπηση"}
          alt="Προεπισκόπηση"
          className="Find-Photo"
        />
    </div>

    <div className="u-buttons">
      <Button variant="secondary"  onClick={() => {if (submitSuccess) { navigate("/PetOwnerMenu");  } else {setPetMenu1step(2);}}}>{submitSuccess ? "Υπηρεσίες" : "Πίσω"}</Button>

      <Button
  variant="success"
  onClick={FindhandleSubmit}
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

export default PetMenu3;
