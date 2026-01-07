import {Form,Button } from "react-bootstrap";
import './RegisterStep4.css'
import { useState } from "react";

const RegisterStep4=({ formData,setFormData, onBack,handleConfirm})=> {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    function handleNext()  {
    // Έλεγχος αν οι δύο κωδικοί ταιριάζουν
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$]/.test(password);
        const hasMinLength = password.length >= 8;

        if (password !== confirmPassword) {
        setError('');
        setError('Οι κωδικοί δεν ταιριάζουν!');
        alert(error);
        return;
        }
        if(!(hasUpperCase && hasNumber && hasSpecialChar && hasMinLength)){
            setError('Ο κωδικός πρόσβασης πρέπει να αποτελείται από τουλάχιστον 8 χαρακτήρες και να περιλαμβάνει κεφαλαία γράμματα, αριθμούς και ειδικά σύμβολα (π.χ. !, @, #, $)');
            alert(error);
            return;
        }
        

         const newFormData = { ...formData, password };

        // Στέλνουμε το νέο αντικείμενο στο handleConfirm
        handleConfirm(newFormData);

  // Ενημερώνουμε και το state (προαιρετικό)
        setFormData(newFormData)
    }

    return(

        <Form className="form-box">
            <Form.Group className="mb-3">
                <Form.Label>Κωδικός</Form.Label>
                <Form.Control type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}/>
                <p className="password-hint">Ο κωδικός πρόσβασης πρέπει να αποτελείται από τουλάχιστον 8 χαρακτήρες και να περιλαμβάνει κεφαλαία γράμματα, αριθμούς και ειδικά σύμβολα (π.χ. !, @, #, $).</p>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Επαλήθευση Κωδικού
                </Form.Label>
                <Form.Control 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} />
            </Form.Group>

            <div className="step-buttons">
                <Button variant="secondary" onClick={onBack}>
                ΠΙΣΩ
                </Button>

                <Button variant="success" className="ConfirmButton" onClick={handleNext}>
                ΕΠΙΒΕΒΑΙΩΣΗ
                </Button>
            </div>
      </Form>



    )
}

export default RegisterStep4