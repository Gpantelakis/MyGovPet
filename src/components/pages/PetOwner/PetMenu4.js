import { useState } from "react";
import { useEffect } from "react";
import { Button,Table,Spinner } from "react-bootstrap";
import './PetMenu4.css'
import DeclarationView from "./../../modules/DeclarationsView";

function PetMenu4({userId}){
  // Συνδυάζουμε lost και found σε ένα array για τον πίνακα
    const [lostPets, setLostPets] = useState([]);
    const [findPets, setFindPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("ALL");
    const [showDeclaration, setShowDeclaration] = useState(false);
    const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("el-GR");
};
const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lostRes, findRes] = await Promise.all([
          fetch(`http://localhost:3001/lostPets?userId=${userId}`),
          fetch(`http://localhost:3001/FindPets?userId=${userId}`)
        ]);

        const lostData = await lostRes.json();
        const findData = await findRes.json();

        setLostPets(lostData);
        setFindPets(findData);
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
    ...lostPets.map(p => ({
      id: p.id,
      type: "Απώλεια Κατοικιδίου",
      date: p.LostDate,
      petName: p.petName,
      chipNumber: p.chipNumber,
      found: p.status === "inactive", // αν inactive → βρέθηκε
    })),
    ...findPets.map(p => ({
      id: p.id,
      type: "Εύρεση Κατοικιδίου",
      date: p.FindDate,
      petName: p.petName,
      chipNumber: p.chipNumber,
      found: true,
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const allDeclarations = declarations.filter(d => {
  // Φίλτρο τύπου
  if (filterType !== "ALL" && d.type !== filterType) return false;

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
            <span className="active">&gt; Ιστορικό δηλώσεων</span>
        </div>
        <div className="pet-menu-history">
            <div style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                ΙΣΤΟΡΙΚΟ ΔΗΛΩΣΕΩΝ
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
                    filterType === "Απώλεια Κατοικιδίου"
                        ? "danger"
                        : "outline-danger"
                    }
                    onClick={() => setFilterType("Απώλεια Κατοικιδίου")}
                >
                    Απώλεια
                </Button>

                <Button
                    variant={
                    filterType === "Εύρεση Κατοικιδίου"
                        ? "success"
                        : "outline-success"
                    }
                    onClick={() => setFilterType("Εύρεση Κατοικιδίου")}
                >
                    Εύρεση
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
                    <th>Τύπος Δήλωσης</th>
                    <th>Ημερομηνία</th>
                    <th>Κατοικίδιο</th>
                    <th>Chip Number</th>
                    <th>Κατάσταση</th>
                    <th>Προβολή</th>
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
                        <td>{d.type}</td>
                        <td>{formatDate(d.date)}</td>
                        <td>{d.petName}</td>
                        <td>{d.chipNumber}</td>
                        <td>
                            {d.type === "Απώλεια Κατοικιδίου" ? (
                                d.found ? (
                                    <span className="status-found">Βρέθηκε</span>
                                ) : (
                                    <span className="status-missing">Αγνοείται</span>
                                )
                                ) : null
                            }
                        </td>
                        <td>
                        <Button size="sm" variant="outline-primary" onClick={() => {setSelectedDeclaration(d); setShowDeclaration(true); }}>
                            Προβολή
                        </Button>
                        </td>
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

export default PetMenu4;