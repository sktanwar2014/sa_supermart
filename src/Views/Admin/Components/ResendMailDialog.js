import React, {Fragment, useState} from 'react';
import {Modal, Button} from 'react-bootstrap';

import { validEmail} from '../../../common/Validation/Regex.js';
import AuthAPI from '../../../api/auth.js';

export default function ResendMailDialog({open, setShowEmailDialog, handleMailBoxClose, clientData, setIsLoading}) {
    
    const [email, setEmail] = useState(clientData.email);
    const [errors, setErrors] = useState({email:''});
    const [isVerified, setIsVerified] = useState(0);
    

    const handleMailAvaibility = async () => {
        setIsLoading(true);
        setIsVerified(0);
        try{
            if (!email) {
                setErrors({...errors, ['email']: 'Email Address is missing'});
            } else if (!validEmail.test(email)) {
                setErrors({...errors, ['email']: 'Email Address is invalid'});
            } else if(email === clientData.email){
                setErrors({...errors, ['email']: ''});
                setIsVerified(1);
            }else {
                setErrors({...errors, ['email']: ''});
                const result = await AuthAPI.verifyEmail({email : email});
                if(result.isExist === true){
                    setErrors({...errors, ['email']: 'Email already registered'});
                }else {
                    setIsVerified(1);
                }
            }
            setIsLoading(false);
        }catch(e){
            console.log("Error...", e);
        }
    }

    const handleResendMailLink = async () => {
        setIsLoading(true);
        setIsVerified(0);
        try{
            const result = await AuthAPI.resendEmailVarificationLink({
                email : email,
                user_id : clientData.id,
            });            
            setIsLoading(false);
            handleMailBoxClose(result);
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
  