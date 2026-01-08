import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterStep1 from "../RegisterSteps/RegisterStep1";
import RegisterStep2 from "../RegisterSteps/RegisterStep2";
import RegisterStep3 from "../RegisterSteps/RegisterStep3";
import RegisterStep4 from "../RegisterSteps/RegisterStep4";

function Register() {
  const [Registerstep, setRegisterStep] = useState(1);
  const [role, setRole] = useState("");
  const navigate=useNavigate();

  const [formData, setFormData] = useState({
  role:"",
  firstName: "",
  lastName: "",
  phone: "",
  afm: "",
  gender: "",
  studies: "",
  street: "",
  streetNumber: "",
  postalCode: "",
  email: "",
  password:""
});

function handleConfirm (submitData) {
  fetch(`http://localhost:3001/users?email=${submitData.email}`)
    .then(res => res.json())
    .then(users => {
      if (users.length > 0) {
        alert("Το email χρησιμοποιείται ήδη");
        return;
      }

      // Αν ΔΕΝ υπάρχει email → αποθήκευση
      return fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });
    })
    .then(res => {
      if (!res) return;
      return res.json();
    })
    .then(newUser => {
      if (!newUser) return;
      alert("Η εγγραφή ολοκληρώθηκε!");
      localStorage.setItem("userId", newUser.id);
      console.log("Νέος χρήστης:", newUser);
      window.location.href = "/Home";

    })
    .catch(err => {
      console.error(err);
      alert(err);
    });
};

  return (
    <>
      {Registerstep === 1 && (
        <RegisterStep1
          role={role}
          setRole={setRole}
          setFormData={setFormData}
          onNext={() => setRegisterStep(2)}
        />
      )}

      {Registerstep === 2 && (
          <RegisterStep2
            formData={formData}
            setFormData={setFormData}
            onBack={() => setRegisterStep(1)}
            onNext={() => setRegisterStep(3)}
          />
      )}
      {Registerstep === 3 && (
        <RegisterStep3
        formData={formData}
        onBack={() => setRegisterStep(2)}
        onNext={() => setRegisterStep(4)}
     />
      )}
      {Registerstep === 4 && (
        <RegisterStep4
        formData={formData}
        setFormData={setFormData}
        
        onBack={() => setRegisterStep(3)}
        handleConfirm={handleConfirm}
     />
      )}

      
    </>
  );
}

export default Register;
