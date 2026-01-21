import { useParams } from "react-router-dom";
import PetMenu1 from "../PetOwner/PetMenu1"
import PetMenu2 from "../PetOwner/PetMenu2"
import PetMenu3 from "../PetOwner/PetMenu3"
import PetMenu4 from "../PetOwner/PetMenu4"
import PetMenu5 from "../PetOwner/PetMenu5"
import PetMenu6 from "../PetOwner/PetOwner6"
import LoginModal from "../Login";
import { useState,useEffect } from "react";

// Το ίδιο array services που έχεις στο PetOwnerServices
const services = [
  { id: 1, title: "Στοιχεία και βιβλιάριο υγείας κατοικιδίου", content: "Εδώ μπορείς να δεις όλα τα στοιχεία του βιβλιαρίου του κατοικιδίου σου." },
  { id: 2, title: "Δήλωση Απώλειας κατοικιδίου", content: "Φόρμα για να δηλώσεις την απώλεια του κατοικιδίου σου." },
  { id: 3, title: "Δήλωση Εύρεσης Κατοικιδίου", content: "Φόρμα για να δηλώσεις ότι βρήκες ένα κατοικίδιο." },
  { id: 4, title: "Ιστορικό Δηλώσεων", content: "Εδώ εμφανίζεται το ιστορικό των δηλώσεων που έχεις κάνει." },
  { id: 5, title: "Ραντεβού με Κτηνίατρο", content: "Βρες και κλείσε ραντεβού με τον κατάλληλο κτηνίατρο." },
  { id: 6, title: "Αναζήτηση και Αξιολόγηση Κτηνιάτρου", content: "Αναζήτησε κτηνίατρο ή δώσε αξιολόγηση σε ήδη γνωστούς κτηνιάτρους." },
  { id: 7, title: "Ακύρωση Ραντεβού με Κτηνίατρο", content: "Ακύρωσε το ραντεβού σου με τον κτηνίατρο." },
  { id: 8, title: "Ιστορικό των Ραντεβού με Κτηνίατρο", content: "Δες όλα τα ραντεβού που έχεις κλείσει με τους κτηνιάτρους." },
];

function ServicePage() {
  // Παίρνουμε το id από το URL
  
  const { id } = useParams();

  const service = services.find(s => s.id === Number(id));

  const [showLogin,SetShowLogin]=useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      SetShowLogin(true); // δείχνει το modal login αν δεν υπάρχει userId
    }
  }, []);
  const handleClose = () => SetShowLogin(false);

  // Αν δεν υπάρχει service με αυτό το id
  if (!service) {
    return <p>Η υπηρεσία δεν βρέθηκε.</p>;
  }

  const userId = localStorage.getItem('userId');

  if(userId){
  
    if (id === "1") {
      return <PetMenu1 userId={userId}/>;
    }
    if (id === "2") {
      return <PetMenu2 userId={userId}/>;
    }
     if (id === "3") {
      return <PetMenu3 userId={userId}/>;
    }
    if (id === "4") {
      return <PetMenu4 userId={userId}/>;
    }
    if (id === "5") {
      return <PetMenu5/>;
    }
    if (id === "6") {
      return <PetMenu6/>;
    }
  }else{
    
  }

  return (
     

    <div style={{ padding: "2rem" }}>
      <LoginModal show={showLogin} handleClose={handleClose} />
      <h1>{service.title}</h1>
      <h3>Παρακαλούμε συνδεθείτε πρώτα στην πλατφόρμα</h3>
    </div>
  );
}

export default ServicePage;
