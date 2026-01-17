import { useEffect, useState } from "react";
import { Table, Spinner,Button } from "react-bootstrap";
import './PetMenu5.css';

function PetMenu5() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="pet-menu-vets" >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>ΚΤΗΝΙΑΤΡΟΙ</h2>
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
                vets.map((vet) => (
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
                        
                        {(vet.appointments || vet.availableAppointments.filter(a => a.status === "available").length === 0) ? (
                            <span>Δεν υπάρχουν διαθέσιμα ραντεβού</span>
                        ) : (
                            <div className="appointments">
                                {vet.availableAppointments
                                    .filter(a => a.status === "available")
                                    .map((appt, i) => (
                                    <Button
                                        key={i}
                                        variant="success"
                                        className="appointment-pill"
                                        onClick={() => alert(`Κλείσιμο ραντεβού: ${formatDateTime(appt.time)}`)}
                                    >
                                        {formatDateTime(appt.time)}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </Table>
      </div>
    </div>
  );
}

export default PetMenu5;
