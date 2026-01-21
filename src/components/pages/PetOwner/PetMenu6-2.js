import { useNavigate,useParams } from "react-router-dom";
import { Button,Table,Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { CIcon } from '@coreui/icons-react'
import {cilMoodVeryBad,cilMoodBad,cilMeh,cilMoodGood,cilMoodVeryGood,} from '@coreui/icons'
import Card from "../../modules/Card";
import { ratingIcons } from "../../modules/IconsConfig";
import './PetMenu6-2.css'

function PetMenu6Step2() {
    const { vetId } = useParams();
    const navigate = useNavigate();

    const [vet, setVet] = useState(null);
    const [user, setUser] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState({ fullName: "", message: "" });
    const [rating, setRating] = useState(0)
    const [comments, setComments] = useState([])
 

    const [formData, setFormData] = useState({
    fullName: "",
    Vetfullname:"",
    message: "",
    });


    useEffect(() => {
        const fetchData = async () => {
        const vetRes = await fetch(`http://localhost:3001/vets/${vetId}`);
        const vetData = await vetRes.json();
        setVet(vetData);

        const userRes = await fetch(`http://localhost:3001/users/${localStorage.getItem('userId')}`);
        const userData = await userRes.json();
        setUser(userData);
        
        const commentRes = await fetch("http://localhost:3001/comments?vetid="+vetId);
        const commentData = await commentRes.json();
        setComments(commentData);


        setFormData(prev => ({
        ...prev,
        fullName: `${userData.firstName} ${userData.lastName}`,
        Vetfullname:`${vetData.firstName} ${vetData.lastName}`,
        }));
        };

        fetchData();
    }, [vetId]);

        // Add a comment (POST request)
    const addComment = async (text) => {
        const newComment = { user: "You", body: text };

        const res = await fetch("http://localhost:3001/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
    });

    const savedComment = await res.json();
        setComments([savedComment, ...comments]); // update local state
    };
    
    const handleSubmit = async () => {
    
    const startTime = Date.now();

    let valid = true;
    const newErrors = { message: "" };

    if (!formData.message.trim()) {
        newErrors.message = "Τα σχόλια είναι υποχρεωτικό.";
        valid = false;
    }

    if(rating===0){
        newErrors.message = "Παρακαλώ αξιολογήστε τον κτηνίατρο.";
        valid = false;
    }

    setErrors(newErrors);
    

    if (!valid) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3001/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.firstName+" "+user.lastName,
          vetid:vet.id,
          rating: rating,
          body:formData.message
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
            <span className="active">&gt; Αναζήτηση Κτηνιάτρου</span>
            <span className="active">&gt; Επισκόπηση και Υποβολή Αξιολογήσεων</span>
        </div>
        <div style={{ padding:"40px" }}>
            {!vet || !user ? (
            <p>Φόρτωση δεδομένων...</p>
            ) : (
            <div>
                <div className="overview-info">
                    <div className="overview-form">
                            Ονοματεπώνυμο:
                            <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData({ ...formData, fullName: e.target.value } )
                            }
                            disabled

                            style={{ width: "100%", marginBottom: "8px" }}
                            />

                            Ονοματεπώνυμο Ιατρού:
                            <input
                            type="text"
                            value={formData.Vetfullname}
                            onChange={(e) =>
                                setFormData({ ...formData, Vetfullname: e.target.value } )
                            }
                            disabled
                            style={{ width: "100%", marginBottom: "8px" }}
                            />
                                <div style={{ marginBottom: '12px', maxWidth:"400px" }}>
                                    <label style={{ fontWeight: 'bold' }}>Αξιολόγηση</label>

                                    <div style={{ display: 'flex', gap: '12px', fontSize: '2rem', marginTop: '6px' }}>
                                           {ratingIcons.map((ic) => (
                                                <CIcon
                                                    key={ic.value}
                                                    icon={ic.icon}
                                                    title={ic.label}
                                                    onClick={() => setRating(ic.value)}
                                                    className={`rating-icon ${rating === ic.value ? "active" : ""}`}
                                                    style={{ "--icon-color": ic.color }}
                                                />
                                                ))
                                            }
                                    </div>
                            </div>

                            Σχόλια
                            <textarea
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                            placeholder="Προσθέστε ένα σχόλιο..."
                            rows={3}
                            style={{ width: "100%", marginBottom: "12px" }}
                            />
                            {errors.message && <p className="error-text">{errors.message}</p>}
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
                        <div className="Feed">
                            <h1 style={{textAlign:"center"}}>Αξιολογήσεις</h1>
                            <div className="feed-container">
                                {comments.length === 0 ? (
                                    <p>No stories yet. Be the first to add one!</p>
                                ) : (
                                    comments.map((comment) => (
                                    <Card key={comment.id} comment={comment} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Πίσω
                    </Button>
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

export default PetMenu6Step2;
