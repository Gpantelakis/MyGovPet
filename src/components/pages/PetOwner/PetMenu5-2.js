import { useNavigate,useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";

function PetMenu5Step2() {
    const { vetId, time } = useParams();
    const navigate = useNavigate();
    const decodedTime = decodeURIComponent(time);

    const [vet, setVet] = useState(null);
    const [user, setUser] = useState(null);
    const [pet, setPet]= useState(null);
    

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
  

  return (
  <div style={{ maxWidth: "500px", margin: "40px auto" }}>
    {!vet || !user ? (
      <p>Φόρτωση δεδομένων...</p>
    ) : (
      <>
        <h3>Λεπτομέρειες Ραντεβού</h3>
        <p>
          <strong>Ημερομηνία:</strong>{" "}
          {new Date(decodedTime).toLocaleString("el-GR")}
        </p>
        <p>
          <strong>Ιατρός:</strong> {vet.firstName} {vet.lastName}
        </p>
        <p>
          <strong>Διεύθυνση:</strong> {vet.clinicAddress}
        </p>

        <input
          type="text"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          style={{ width: "100%", marginBottom: "8px" }}
        />
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

        <select value={formData.selectedPetChip || ""}
            onChange={(e) =>setFormData({ ...formData, selectedPetChip: e.target.value })}  style={{ width: "100%", marginBottom: "8px" }} >
            {pet?.map((p, i) => (
                <option key={i} value={p.chipNumber}>{p.chipNumber}</option>))}
        </select>
        
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Μήνυμα προς τον κτηνίατρο"
          rows={3}
          style={{ width: "100%", marginBottom: "12px" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Πίσω
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              console.log({
                vetId,
                appointmentTime: decodedTime,
                userId: user.id,
                ...formData,
              });
              alert("Η αίτηση στάλθηκε");
            }}
          >
            Υποβολή Αίτησης
          </Button>
        </div>
      </>
    )}
  </div>
);

}

export default PetMenu5Step2;
