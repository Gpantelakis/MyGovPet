import { useState } from "react";
import { useEffect } from "react";
import { Button,Table,Spinner } from "react-bootstrap";
import './PetMenu8.css'
import DeclarationView from "./../../modules/DeclarationsView";
import { useNavigate } from "react-router-dom";

function PetMenu8({userId}){
  // Συνδυάζουμε lost και found σε ένα array για τον πίνακα
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("ALL");
    const [showDeclaration, setShowDeclaration] = useState(false);
    const [selectedDeclaration, setSelectedDeclaration] = useState(null);
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("el-GR");
    };

    const formatDateTime = (dtString) => {
        if (!dtString) return "-";

        const date = new Date(dtString);
        return encodeURIComponent(date.toISOString()); 
    };

    const formatTime = (dateString) => {
        if (!dateString) return "-";
        return  dateString.split("T")[1].slice(0, 5);
    };

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const navigate=useNavigate()

    const[Appoitments,setAppoitments]=useState([]);
    const[Vet,setVet]=useState([])

    const vetMap = {};
        Vet.forEach(v => {
        vetMap[v.id] = `${v.firstName} ${v.lastName}`;
    });

    

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appoitmentsRes = await fetch("http://localhost:3001/appointments?userId="+userId);
        const appoitmentData = await appoitmentsRes.json();
        setAppoitments(appoitmentData);

        
        // ΠΑΡΕ vetIds
        const vetIds = appoitmentData.map(a => a.vetId);

        // Αν θέλεις ΜΟΝΑΔΙΚΑ
        const uniqueVetIds = [...new Set(vetIds)]

        const params=new URLSearchParams();
        uniqueVetIds.forEach(v => params.append("vetid", v));

        const VetRes = await fetch("http://localhost:3001/vets?"+params.toString());
        const VetData = await VetRes.json();
        setVet(VetData);

      } catch (err) {
        console.error("Σφάλμα φόρτωσης δεδομένων", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const resetFilters = () => {
    setFilterType("ALL");
    setDateFrom("");
    setDateTo("");
}

  const declarations = [
    ...Appoitments.map(p => ({
      id: p.id,
      appointmentTime: p.appointmentTime,
      Locations: p.Locations,
      chipNumber: p.selectedPetChip,
      status:p.status,
      vetName: vetMap[p.vetId],
      vetId:p.vetId,
      message:p.message
    }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const allDeclarations = declarations.filter(d => {
        // Φίλτρο τύπου 
        if (filterType !== "ALL" && d.status !== filterType) return false;
        // Φίλτρο ημερομηνίας
        const declDate = new Date(d.date);
        if (dateFrom && declDate < new Date(dateFrom)) return false;
        if (dateTo && declDate > new Date(dateTo)) return false;

        return true;
  
    });

    if (loading) {
    return (
      <div className="loading-wrapper">
        <Spinner animation="border" />
        <p>Φόρτωση ιστορικού...</p>
      </div>
    );
  }

  return (
    <>
        <div className="u-step-indicator">
            <span className="active">Υπηρεσίες Ιδιοκτήτη </span>
            <span className="active">&gt; Ιστορικό των Ραντεβού σας</span>
        </div>
        <div className="pet-menu-history">
            <div style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                ΑΚΎΡΩΣΗ ΡΑΝΤΕΒΟΥ
            </h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <Button
                    variant={filterType === "ALL" ? "primary" : "outline-primary"}
                    onClick={() => setFilterType("ALL")}
                >
                    Όλα
                </Button>

                <Button
                    variant={
                    filterType === "forApproval"
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() => setFilterType("forApproval")}
                >
                    Προς Έγκριση
                </Button>

                <Button
                    variant={
                    filterType === "Approved"
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() => setFilterType("Approved")}
                >
                    Εγκεκριμένα
                </Button>
                <Button
                    variant={
                    filterType === "Canceled"
                        ? "danger"
                        : "outline-danger"
                    }
                    onClick={() => setFilterType("Canceled")}
                >
                    Ακυρωμένα
                </Button>
                    <input 
                    type="date" 
                    value={dateFrom} 
                    onChange={(e) => setDateFrom(e.target.value)} 
                    placeholder="Από" 
                    className="DateFilter"
                    />
                    <input 
                    type="date" 
                    value={dateTo} 
                    onChange={(e) => setDateTo(e.target.value)} 
                    placeholder="Έως" 
                    className="DateFilter"
                    />
                <Button
                    variant={
                    filterType === "Καθαρισμός φίλτρων" && dateTo==="" && dateFrom===""
                        ? "info"
                        : "outline-info"
                    }
                    onClick={() => resetFilters()}
                >Καθαρισμός φίλτρων</Button>
            </div>

            <Table bordered hover responsive>
                <thead style={{ background: "#f1f1f1" }}>
                <tr>
                    <th>Α/Α</th>
                    <th>Λόγος</th>
                    <th>Ημερομηνία</th>
                    <th>Ώρα</th>
                    <th>Τοποθεσία</th>
                    <th>Τσιπ Κατοικιδίου</th>
                    <th>Κατάσταση</th>
                    <th>Κτηνίατρος</th>
                </tr>
                </thead>

                <tbody>
                {allDeclarations.length === 0 ? (
                    <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                        Δεν υπάρχουν δηλώσεις
                    </td>
                    </tr>
                ) : (
                    allDeclarations.map((d, i) => (
                    <tr key={d.id}>
                        <td>{i + 1}</td>
                        <td>{d.message}</td>
                        <td>{formatTime(d.appointmentTime)}</td>
                        <td>{formatDate(d.appointmentTime)}</td>
                        <td>{d.Locations}</td>
                        <td>
                            {d.status === "Approved" ? (
                                <span className="status-approved">Εγκρίθηκε</span>
                            ):d.status === "forApproval" ? (
                                <span className="status-forapp">Προς Έγκριση</span>
                            ):d.status === "Canceled" ? (
                                <span className="status-unknown">Ακυρώθηκε</span>
                            ) : (
                                <span className="status-unknown">Απορρίφθηκε</span>
                            )
                            }
                        </td>
                        <td>{d.chipNumber}</td>
                        <td>{d.vetName}</td>
                    </tr>
                    ))
                )}
                </tbody>
            </Table>
            </div>
        </div>
        {showDeclaration && selectedDeclaration && (
            <DeclarationView
            declaration={selectedDeclaration}
            onClose={() => setShowDeclaration(false)}
            />
        )}
        <div className="btn1">
        <Button variant="dark" onClick={()=>{navigate("/PetOwnerMenu")}}>Υπηρεσίες</Button>
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

export default PetMenu8;