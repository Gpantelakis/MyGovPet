import { useEffect, useState } from "react";
import { Table, Spinner,Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './PetMenu5.css';

function PetMenu5() {
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
    area: "",
    fromDate: "",
    toDate: "",
    specialty: ""
        });
    const startOfDay = (dateStr) =>
    new Date(`${dateStr}T00:00:00`);

    const endOfDay = (dateStr) =>
    new Date(`${dateStr}T23:59:59`);

    const navigate=useNavigate();


    const areas = [...new Set(vets.map(v => v.clinicAddress?.split(",")[1]?.trim()).filter(Boolean))];
    const specialties = [...new Set(vets.map(v => v.special).filter(Boolean))];
    
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await fetch("http://localhost:3001/vets");
        const data = await res.json();
        setVets(data);
      } catch (err) {
        console.error("Σφάλμα φόρτωσης κτηνιάτρων", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVets();
  }, []);

  const formatDateTime = (dtString) => {
    if (!dtString) return "-";
    const options = { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dtString).toLocaleString("el-GR", options);
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <Spinner animation="border" />
      <p>Φόρτωση κτηνιάτρων...</p>
    </div>
  );

  const filteredVets = vets.filter(vet => {
        if (filters.area && !vet.clinicAddress.includes(filters.area)) {
            return false;
        }

        if (filters.specialty && vet.special !== filters.specialty) {
            return false;
        }

        if (filters.fromDate || filters.toDate) {
            const from = filters.fromDate ? startOfDay(filters.fromDate) : null;
            const to = filters.toDate ? endOfDay(filters.toDate) : null;

            const hasValidAppointment = vet.availableAppointments?.some(a => {
                if (a.status !== "available") return false;

                const d = new Date(a.time);
                if (from && d < from) return false; 
                
                if (to && d > to)  return false;
                console.log("d, to,from:" + d , to,from)
                return true;
            });

            if (!hasValidAppointment) return false;
}


        return true;
    });
    

  return (
    <>
    <div className="pet-menu-vets" >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>ΚΤΗΝΙΑΤΡΟΙ</h2>
        <div className="filters">
            <select
                value={filters.area}
                onChange={e => setFilters({ ...filters, area: e.target.value })}
            >
                <option value="">Όλες οι περιοχές</option>
                {areas.map((area, i) => (
                <option key={i} value={area}>{area}</option>
                ))}
            </select>

            <input
                type="date"
                value={filters.fromDate}
                onChange={e => setFilters({ ...filters, fromDate: e.target.value })}
            />

            <input
                type="date"
                value={filters.toDate}
                onChange={e => setFilters({ ...filters, toDate: e.target.value })}
            />

            <select
                value={filters.specialty}
                onChange={e => setFilters({ ...filters, specialty: e.target.value })}
            >
                <option value="">Όλες οι ειδικότητες</option>
                {specialties.map((s, i) => (
                <option key={i} value={s}>{s}</option>
                ))}
            </select>
            <Button
                variant="secondary"
                onClick={() => setFilters({ area: "", fromDate: "", toDate: "", specialty: "" })}
                style={{ marginLeft: "10px" }}
                >
                Καθαρισμός φίλτρων
            </Button>
        </div>

      <div className="vets-table">
        <Table bordered hover responsive>
            <thead style={{ background: "#f1f1f1" }}>
            <tr>
                <th>Κτηνίατρος</th>
                <th>Διαθέσιμα Ραντεβού</th>
            </tr>
            </thead>
            <tbody>
            {vets.length === 0 ? (
                <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>Δεν υπάρχουν κτηνίατροι</td>
                </tr>
            ) : (
                filteredVets.map((vet) => (
                <tr key={vet.id}>
                    <td style={{ verticalAlign: "top" }}>
                    <h4>{vet.firstName} {vet.lastName}</h4>
                    <p>{vet.special}</p>
                    <p>{vet.clinic}</p>
                    <a href={`tel:${vet.phone}`}>{vet.phone}</a><br/>
                    <a href={`mailto:${vet.email}`}>{vet.email}</a><br/>
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vet.clinicAddress)}`} 
                        target="_blank" rel="noopener noreferrer"
                    >
                        {vet.clinicAddress}
                    </a>
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                        
                        {(() => {
                            const from = filters.fromDate ? startOfDay(filters.fromDate) : null;
                            const to = filters.toDate ? endOfDay(filters.toDate) : null;

                            const visibleAppointments = vet.availableAppointments
                            ?.filter(a => a.status === "available")
                            .filter(a => {
                                const d = new Date(a.time);
                                if (from && d < from) return false;
                                if (to && d > to) return false;
                                return true;
                            }) || [];
                            if (visibleAppointments.length === 0) {
                            return <span>Δεν υπάρχουν διαθέσιμα ραντεβού</span>;
                            }

                            return (
                            <div className="appointments">
                                {visibleAppointments.map((appt, i) => (
                                <Button
                                    key={i}
                                    variant="success"
                                    className="appointment-pill"
                                    onClick={() =>
                                            navigate(
                                            `/petmenu5/appointment/${vet.id}/${encodeURIComponent(appt.time)}`
                                            )
                                        }
                                    >
                                    {formatDateTime(appt.time)}
                                </Button>
                                ))}
                            </div>
                            );
                        })()}
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </Table>
      </div>
      <div className="btn1">
        <Button variant="dark" onClick={()=>{navigate("/PetOwnerMenu")}}>Υπηρεσίες</Button>
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

export default PetMenu5;
