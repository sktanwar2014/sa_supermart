import React, {Fragment, useState} from 'react';
import {Modal, Button} from 'react-bootstrap';

import { validEmail} from '../../../common/Validation/Regex.js';
import AuthAPI from '../../../api/auth.js';

export default function ResendMailDialog({open, setShowEmailDialog, clientData}) {
    
    const [email, setEmail] = useState(clientData.email);
    const [errors, setErrors] = useState({email:''});
    const [isVerified, setIsVerified] = useState(0);
    

    const handleMailAvaibility = async () => {
        try{
            setIsVerified(0);
            if(email === clientData.email){
                setErrors({...errors, ['email']: ''});
                setIsVerified(1);
            }else if (!email) {
                setErrors({...errors, ['email']: 'Email Address is missing'});
            } else if (!validEmail.test(email)) {
                setErrors({...errors, ['email']: 'Email Address is invalid'});
            } else {
                setErrors({...errors, ['email']: ''});
                const result = await AuthAPI.verifyEmail({email : email});
                if(result.isExist === true){
                    setErrors({...errors, ['email']: 'Email already registered'});
                }else {
                    setIsVerified(1);
                }
            }
        }catch(e){
            console.log("Error...", e);
        }
    }

    const handleResendMailLink = async () => {
        try{
            const result = await AuthAPI.resendEmailVarificationLink({
                email : email,
                user_id : clientData.id,
            });
            setIsVerified(0);
            console.log(result);
        }catch(e){
            console.log("Error...", e);
        }
    }

    return (
      <Fragment>
        <Modal
          show={open}
          onHide={() => {setShowEmailDialog(false)}}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Resend email confirmation link</Modal.Title>
          </Modal.Header>          
            <Modal.Body>
                <div class="col-md-12">
                    <div class="form-group">
                        <div class="field">
                            <div class="w-100">
                                <label for="email">Email address *</label>
                                <input type="email" class="form-control" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
                                <button class="check-avaibility"  onClick={handleMailAvaibility}> Check Avaibility</button>
                            </div>
                            <span style={{color: 'red', marginLeft: '10px', fontSize: '12px'}}>{errors.email}</span>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShowEmailDialog(false)}}> Close </Button>
                <Button type="submit" variant="primary" disabled = {isVerified === 0} onClick={handleResendMailLink}> Click to Resend </Button>
            </Modal.Footer>          
        </Modal>
    </Fragment>
    );
  }
  