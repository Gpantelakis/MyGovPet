import { useState } from "react";
import RegisterStep1 from "../RegisterSteps/RegisterStep1";
import RegisterStep2 from "../RegisterSteps/RegisterStep2";

function Register() {
  const [Registerstep, setRegisterStep] = useState(1);
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  phone: "",
  afm: "",
  gender: "",
  studies: "",
  street: "",
  streetNumber: "",
  postalCode: "",
  email: ""
});

  return (
    <>
      {Registerstep === 1 && (
        <RegisterStep1
          role={role}
          setRole={setRole}
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
    </>
  );
}

export default Register;
