import React, {useState, Fragment} from 'react';

// Components
import {APP_TOKEN} from '../../api/config/Constants';
import AuthAPI from '../../api/auth.js';

import {SimpleAlert} from  '../../common/Alert.js';
import CallLoader from '../../common/Loader.js';
import validate from '../../common/Validation/RegistrationFormRule.js';
import {validNumber, validEmail, validNonSpaceString} from '../../common/Validation/Regex.js';

const RESET_VALUES = {
    firstname : '',
    lastname : '',
    mobile : '',
    email : '',
    email_verification : false,
    userId : '',
    userId_verification : false,
    password : '',    
    confirmpassword : '',
};

export default function Login(props){
    
    const history = props.history;
    const [inputs, setInputs] = useState(RESET_VALUES);
    const [errors, setErrors] = useState(RESET_VALUES);
    const [isInvalideCredentials, setIsInvalideCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRegisteredMsg, setShowRegisteredMsg] = useState(false);

    
    const handleInputChange  = (props) => {
      setInputs({...inputs, [props.target.name]: props.target.value});
      setIsInvalideCredentials(false);
    }

    const handleNumberInput = e => {
        if (e.target.value === '' || validNumber.test(e.target.value)) {
          setInputs({...inputs, [e.target.name]: e.target.value });
        }
    }
    
    const handleEmailVerification = async (e) => {
        const email = e.target.value;        
        try{
            if (!email) {
                setErrors({...errors, ['email']: 'Email Address is missing'});            
            }  else if (!validEmail.test(email)) {
                setErrors({...errors, ['email']: 'Email Address is invalid'});
            }else {
                setErrors({...errors, ['email']: ''});
                setInputs({...inputs, ['email_verification']: false});
                const result = await AuthAPI.verifyEmail({email : email});
                if(result.isExist === true){
                    setErrors({...errors, ['email']: 'Email already registered'});
                    setInputs({...inputs, ['email_verification']: true});
                }
            }
        }catch(e){
            console.log("Error...", e);
        }
    }

    const handleUserIdVerification = async (e) => {
        const userId = e.target.value;
        try{
            if (!userId) {
                setErrors({...errors, ['userId']: 'User id is missing'});
            }  else if(!validNonSpaceString.test(userId)) {
                setErrors({...errors, ['userId']: 'Invalid user id'});
            }  else {
                setErrors({...errors, ['userId']: ''});
                setInputs({...inputs, ['userId_verification']: false});
                const result = await AuthAPI.verifyUserId({user_id : userId});
                if(result.isExist === true){
                    setErrors({...errors, ['userId']: 'User id already exist'});
                    setInputs({...inputs, ['userId_verification']: true});
                }
            }
        }catch(e){
            console.log("Error...", e);
        }
    }

    const handleRegistration = async (e) => {       
        e.preventDefault();

        const errors = await validate(inputs);
        setErrors(errors);

        if(Object.values(errors).length === 0){
            setIsLoading(true);
            setIsSubmitting(true);
            try{
                const result = await AuthAPI.register({
                    firstname : inputs.firstname,
                    lastname : inputs.lastname,
                    mobile : inputs.mobile,
                    email : inputs.email,
                    user_id : inputs.userId,
                    password : inputs.password,
                });
                if(result.isRegistered === true){
                    setInputs(RESET_VALUES);
                    setShowRegisteredMsg(true);
                }                
                setIsLoading(false);
                setIsSubmitting(false);
            }catch(e){
                console.log('Error...',e);
            }
        }
        
    }



    return(
        <Fragment>
            <section className="signup-section">
                <div className= "signup-container">
                    <div className="signup-title-div">
                        <p class="signup-title">SA SUPERMART</p>
                        <p style={{color: 'antiquewhite'}}>Have already an account?</p>
                        <p><a href="/login" style={{color: 'aquamarine', fontWeight: '500'}}>Login here</a></p>                    
                    </div>
                    <div className="signup-form-div">
                        <form onSubmit={handleRegistration} class="billing-form">
						    <div>
                                <h5 className="create-account">Create Account </h5>
                                <hr className="margin-top-0" />
                            </div>
	          	            <div class="row align-items-end m-10">
	          		            <div class="col-md-6">
	                                <div class="form-group">
	                	                <label for="firstname">First Name *</label>
	                                    <input type="text" value={inputs.firstname} name="firstname" id="firstname" class="signup-form-control"  onChange={handleInputChange} />
	                                    <input type="text" value={errors.firstname} disabled  className={errors.firstname ? "error-input d-block" : "error-input d-none" } />
	                                </div>
	                            </div>
	                            <div class="col-md-6">
	                                <div class="form-group">
	                	                <label for="lastname">Last Name *</label>
	                                    <input type="text" value={inputs.lastname} name= "lastname" id="lastname" class="signup-form-control"  onChange={handleInputChange} />
                                        <input type="text" value={errors.lastname} disabled  className={errors.lastname ? "error-input d-block" : "error-input d-none" } />                                        
	                                </div>
                                </div>
            		            <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="mobile">Mobile *</label>
                                        <input type="text" value={inputs.mobile} name="mobile" id="mobile" class="signup-form-control"  onChange={handleNumberInput} />
                                        <input type="text" value={errors.mobile} disabled  className={errors.mobile ? "error-input d-block" : "error-input d-none" } />
                                    </div>
		                        </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="streetaddress">Email Address *</label>
                                        <input type="text" value={inputs.email} name="email" id="email" class="signup-form-control"  onChange={handleInputChange} onBlur={handleEmailVerification} />
                                        <input type="text" value={errors.email} disabled  className={errors.email ? "error-input d-block" : "error-input d-none" }  />
                                    </div>
		                        </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="userId">User Id *</label>
                                        <input type="text" value={inputs.userId} name="userId" id="userId" class="signup-form-control"  onChange={handleInputChange} onBlur={handleUserIdVerification} />
                                        <input type="text" value={errors.userId} disabled  className={errors.userId ? "error-input d-block" : "error-input d-none" } />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="password">Password *</label>
                                        <div className="tooltip-div">
                                            <img src="/images/warning-sign.png" alt="app logo" class="icon-size offset-7"  />
                                            <span class="tooltiptext">
                                                <ul className="m-bottom m-top">
                                                    <li>The string must contain at least 1 lowercase alphabetical character.</li>
                                                    <li>The string must contain at least 1 uppercase alphabetical character.</li>
                                                    <li>The string must contain at least 1 numeric character.</li>
                                                    <li>The string must contain at least one special character.</li>
                                                    <li>The string must be eight characters or longer.</li>
                                                </ul>
                                            </span>
                                        </div>
                                        <input type="password" value={inputs.password} name="password" id="password" class="signup-form-control"  onChange={handleInputChange} />
                                        <input type="text" value={errors.password} disabled  className={errors.password ? "error-input d-block" : "error-input d-none" } />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="confirmpassword">Confirm password *</label>
                                        <input type="password" name="confirmpassword" id="confirmpassword" class="signup-form-control" value={inputs.confirmpassword} onChange={handleInputChange} />
                                        <input type="text" value={errors.confirmpassword} disabled  className={errors.confirmpassword ? "error-input d-block" : "error-input d-none" } />
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <p>
                                            <input type="submit" value="Submit" class="btn btn-primary" disabled={isSubmitting} />                                                
                                        </p>
                                    </div>
                                </div>
                                {showRegisteredMsg ? <SimpleAlert message="Activation link sent on your registered email. Please confirm your account to login." variant="info" style = {{padding:'0px', paddingLeft:'10px', marginTop:'10px'}}/> : ""}
	                        </div>
	                    </form>
                    </div>
                </div>
            </section>
            {isLoading ?   <CallLoader />   : null  }
        </Fragment>
    )
}