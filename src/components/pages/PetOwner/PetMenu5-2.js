import { useNavigate,useParams } from "react-router-dom";
import { Button,Table,Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import './PetMenu5-2.css'

function PetMenu5Step2() {
    const { vetId, time } = useParams();
    const navigate = useNavigate();
    const decodedTime = decodeURIComponent(time);

    const [vet, setVet] = useState(null);
    const [user, setUser] = useState(null);
    const [pet, setPet]= useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState({ fullName: "", message: "" });
    

    const [formData, setFormData] = useState({
    fullName: "",
    petType: "dog",
    petName: "",
    microchip: "",
    message: "",
    selectedPetChip:""
    });

    useEffect(() => {
        const fetchData = async () => {
        const vetRes = await fetch(`http://localhost:3001/vets/${vetId}`);
        const vetData = await vetRes.json();
        setVet(vetData);

        const userRes = await fetch(`http://localhost:3001/users/${localStorage.getItem('userId')}`);
        const userData = await userRes.json();
        setUser(userData);

        const petRes = await fetch(`http://localhost:3001/pets?ownerAfm=${userData.afm}`);
        const petData = await petRes.json();
        if (Array.isArray(petData)) {
        setPet(petData);}
        

        if (petData.length > 0) {
            setFormData(prev => ({
                ...prev,
                selectedPetChip: petData[0].chipNumber
            }));
        }

        setFormData(prev => ({
        ...prev,
        fullName: `${userData.firstName} ${userData.lastName}`
        }));
        };

        fetchData();
        }, [vetId]);
    
    const handleSubmit = async () => {
    
    const startTime = Date.now();

    let valid = true;
    const newErrors = { fullName: "", message: "" };

    if (!formData.fullName.trim()) {
        newErrors.fullName = "Το ονοματεπώνυμο είναι υποχρεωτικό";
        valid = false;
    }

    if (!formData.message.trim()) {
        newErrors.message = "Το μήνυμα είναι υποχρεωτικό";
        valid = false;
    }

    setErrors(newErrors);
    

    if (!valid) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3001/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vetId,
          userId: user.id,
          appointmentTime: decodedTime,
          status: "forApproval",
          ...formData
        })
      });

      if (!res.ok) throw new Error("Failed to submit appointment");

      const elapsed = Date.now() - startTime;
      const minDelay = 2000;

    if (elapsed < minDelay) {
      await new Promise(res => setTimeout(res, minDelay - elapsed));
    }

      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Κάτι πήγε στραβά κατά την υποβολή!");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
    <div className="PageContainer">
        <div className="u-step-indicator" style={{padding:0}}>
            <span className="active">Υπηρεσίες Ιδιοκτήτη </span>
            <span className="active">&gt; Ραντεβού με Κτηνίατρο</span>
            <span className="active">&gt; Συμπλήρωση στοιχείων και υποβολή</span>
        </div>
        <div style={{ padding:"40px" }}>
            {!vet || !user ? (
            <p>Φόρτωση δεδομένων...</p>
            ) : (
            <div>
                <div className="appoitment-info">
                    <div className="appoitment-form">
                            Ονοματεπώνυμο:
                            <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData({ ...formData, fullName: e.target.value })
                            }
                            style={{ width: "100%", marginBottom: "8px" }}
                            />
                            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                            Τύπος Κατοικιδίου:
                            <select
                            value={formData.petType}
                            onChange={(e) =>
                                setFormData({ ...formData, petType: e.target.value })
                            }
                            style={{ width: "100%", marginBottom: "8px" }}
                            >
                            <option value="dog">Σκύλος</option>
                            <option value="cat">Γάτα</option>
                            <option value="parrot">Παπαγάλος</option>
                            <option value="hamster">Χάμστερ</option>
                            </select>
                            
                            Κωδικός Μικροτσιπ:
                            <select value={formData.selectedPetChip || ""}
                                onChange={(e) =>setFormData({ ...formData, selectedPetChip: e.target.value })}  style={{ width: "100%", marginBottom: "8px" }} >
                                {pet?.map((p, i) => (
                                    <option key={i} value={p.chipNumber}>{p.chipNumber}</option>))}
                            </select>
                            
                            Σχόλια
                            <textarea
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                            placeholder="Μήνυμα προς τον κτηνίατρο"
                            rows={3}
                            style={{ width: "100%", marginBottom: "12px" }}
                            />
                            {errors.message && <p className="error-text">{errors.message}</p>}
                        </div>
                        <div className="appoitment-table">
                            <Table style={{width:"100%"}}>
                                <thead>
                                    <tr>
                                        <h3>Λεπτομέρειες Ραντεβού</h3>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Ημερομηνία</td>
                                        <td>{new Date(decodedTime).toLocaleString("el-GR")}</td>
                                    </tr>
                                    <tr>
                                        <td>Ιατρός</td>
                                        <td>{vet.firstName} {vet.lastName}</td>
                                    </tr>
                                    <tr>
                                        <td>Διεύθυνση</td>
                                        <td>{vet.clinicAddress}</td>
                                    </tr>
                                    <tr>
                                        <td>Ειδικότητα</td>
                                        <td>{vet.special}</td>
                                    </tr>
                                    <tr>
                                        <td>Τηλέφωνο</td>
                                        <td>{vet.phone}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="u-buttons">
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Πίσω
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleSubmit}
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
                            "Καταχωρήθηκε"
                        ) : (
                            "Υποβολή Αίτησης"
                        )}
                        </Button>
                    </div>
            
                </div>
            )}
        </div>
        
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

export default PetMenu5Step2;
