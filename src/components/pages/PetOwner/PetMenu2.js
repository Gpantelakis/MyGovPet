import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import './PetMenu1.css'

function PetMenu2({userId},onNext) {
  const [user, setUser] = useState(null);
  const [chipNumber, setChipNumber] = useState("");
  const [pet, setPet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [PetMenu1step,setPetMenu1step]=useState(1)
  const [selectedPet,setSelectedPet]=useState(null)




    // 🔹 Φέρνουμε τον χρήστη με βάση το userId
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
      
      console.log(chipNumber);
      const data = await res.json();
      if (data.length > 0) setPet(data);
      else setPet([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Φόρτωση στοιχείων χρήστη...</p>;
  

 return (
  <div style={{ padding: "2rem" }}>
    

    {/* Parent div περιέχει όλα τα steps */}
    {PetMenu1step === 1 && (
      <div>

        {/*Step Indicator */}
        <div className="u-step-indicator">
          <span className="active">Βήμα 1-Επιλογή Κατοικιδίου</span>
          <span>&gt; Βήμα 2-Στοιχεία και Ιατρικό Ιστορικό Κατοικιδίου</span>
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
                  <h5 style={{ margin: 0 }}>{p.name}</h5>
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
          <Button variant="success">ΑΡΧΙΚΗ</Button>
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
          <span>Βήμα 1-Επιλογή Κατοικιδίου</span>
          <span className="active">&gt; Βήμα 2-Στοιχεία και Ιατρικό Ιστορικό Κατοικιδίου</span>
        </div>

        <div className="info-row" >
          <Row>
              <div className="petinfo-box">

                  <p><strong>Όνομα:</strong> {selectedPet.name}</p>
                  <p><strong>Αριθμός Τσιπ:</strong> {selectedPet.chipNumber}</p>
                  <p><strong>Φύλο:</strong> {selectedPet.sex}</p>
                  <p><strong>Τύπος:</strong> {selectedPet.type}</p>
                  <p><strong>Χρώμα:</strong> {selectedPet.colour}</p>
                  <p><strong>Ημ/νία Γέννησης:</strong> {selectedPet.BirthDate}</p>
                  <p><strong>Κιλά:</strong> {selectedPet.Weight}</p>

              </div>
          </Row>

          <Row>
            <div className="petinfo-box">
                  <p><strong>Ονομα:</strong> {user.firstname}</p>
                  <p><strong>Επώνυμο:</strong> {user.lastname}</p>
                  <p><strong>ΑΦΜ:</strong> {user.afm}</p>
                  <p><strong>Χώρα:</strong> {user.country}</p>
                  <p><strong>Τηλέφωνο:</strong> {user.phone}</p>
                  <p><strong>Φύλο:</strong> {user.gender}</p>
                  <p><strong>Ταχ.Κώδικας:</strong> {user.postalcode}</p>
                  <p><strong>Οδός</strong> {user.street} {user.streetNumber}</p>
                  <p><strong>Email</strong> {user.email}</p>
            </div>
          </Row>
        </div>

        <div className="u-buttons">
          <Button className="no-print" variant="secondary" onClick={() => setPetMenu1step(1)}>Πίσω</Button>

          <Button className="no-print" variant="success" onClick={() => window.print()}>Εκτύπωση</Button>
        </div>
      </div>
    )}
  </div>
);

}

export default PetMenu2;
