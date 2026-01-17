import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import './DeclarationsView.css'

function DeclarationView({ declaration, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint =
      declaration.type === "Απώλεια Κατοικιδίου"
        ? `http://localhost:3001/lostPets/${declaration.id}`
        : `http://localhost:3001/FindPets/${declaration.id}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [declaration]);

  if (loading) return <Spinner />;

  return (
        <div className="declaration-view">
            

            <div className="declaration-content">
                <div className="declaration-details">
                    <h4>{declaration.type}</h4>
                    <p><strong>Όνομα:</strong> {data.petName}</p>
                    <p><strong>Chip:</strong> {data.chipNumber}</p>
                    <p><strong>Περιγραφή:</strong> {declaration.type==="Απώλεια Κατοικιδίου"?(data.Lostcomments):(data.Findcomments)}</p>
                    <p><strong>{declaration.type==="Απώλεια Κατοικιδίου"?("Ημερομηνία Εξαφάνισης:"):("Ημερομηνία Εύρεσης:")}</strong> {declaration.type==="Απώλεια Κατοικιδίου"?(data.LostDate):(data.FindDate)}</p>
                    <p><strong>Ονοματεπώνυμο Ιδιοκτήτη:</strong> {data.ownerName}</p>
                    <p><strong>Τηλέφωνο επικοινωνίας:</strong> {data.phone}</p>
                    <p><strong>Email επικοινωνίας:</strong> {data.email}</p>
                </div>
                <div className="declaration-tools">
                    <img src={data.photo} alt="D-Photo"/>
                

                <Button onClick={onClose}>Κλείσιμο</Button>
                </div>
            </div>
        </div>
    
  );
}

export default DeclarationView;
