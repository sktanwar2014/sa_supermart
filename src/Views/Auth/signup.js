import React, {useState, Fragment} from 'react';

// Components
import {APP_TOKEN} from '../../api/config/Constants';
import AuthAPI from '../../api/auth.js';

import {SimpleAlert} from  '../../common/Alert.js';
import CallLoader from '../../common/Loader.js';
import validate from '../../common/Validation/RegistrationFormRule.js';
import {validNumber} from '../../common/Validation/Regex.js';

const RESET_VALUES = {
    firstname : '',
    lastname : '',
    mobile : '',
    email : '',
    userId : '',
    password : '',    
    confirmpassword : '',
};

export default function Login(props){
    
    const history = props.history;
    const [inputs, setInputs] = useState(RESET_VALUES);
    const [errors, setErrors] = useState(RESET_VALUES);
    const [isInvalideCredentials, setIsInvalideCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleInputChange  = (props) => {
      setInputs({...inputs, [props.target.name]: props.target.value});
      setIsInvalideCredentials(false);
    }

    const handleNumberInput = e => {
        if (e.target.value === '' || validNumber.test(e.target.value)) {
          setInputs({...inputs, [e.target.name]: e.target.value });
        }
    }
    
    const handleValidation = async (e) => {
        const errors = await validate(inputs);
        setErrors(errors);
    }

    const handleRegistration = async (e) => {
        // setIsLoading(true);

        e.preventDefault();
        const errors = await validate(inputs);
        setErrors(errors);
        // try{
        // const result = await AuthAPI.login({
        //     username: inputs.username,
        //     password: inputs.password,
        // });
        // setIsLoading(false);
        //     if(result.length !== undefined && result.length >0){
        //         APP_TOKEN.set(result[0]);
        //         history.push('/');
        //     }else{
        //         setIsInvalideCredentials(true);
        //     }
        // }catch(e){
        //     console.log('Error...',e);
        // }
    }



    return(
        <Fragment>
            <section className="signup-section" style={{backgroundColor: 'ghostwhite'}}>
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
                                        <input type="text" value={inputs.email} name="email" id="email" class="signup-form-control"  onChange={handleInputChange} />
                                        <input type="text" value={errors.email} disabled  className={errors.email ? "error-input d-block" : "error-input d-none" }  />
                                    </div>
		                        </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="userId">User Id *</label>
                                        <input type="text" value={inputs.userId} name="userId" id="userId" class="signup-form-control"  onChange={handleInputChange} />
                                        <input type="text" value={errors.userId} disabled  className={errors.userId ? "error-input d-block" : "error-input d-none" } />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="password">Password *</label>
                                        <input type="password" value={inputs.password} name="password" id="password" class="signup-form-control"  onChange={handleInputChange} />
                                        <input type="text" value={errors.password} disabled  className={errors.password ? "error-input d-block" : "error-input d-none" } />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="confirmpassword">Confirm password *</label>
                                        <input type="password" name="confirmpassword" id="confirmpassword" class="signup-form-control"  onChange={handleInputChange} />
                                        <input type="text" value={errors.confirmpassword} disabled  className={errors.confirmpassword ? "error-input d-block" : "error-input d-none" } />
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <p>
                                            <input type="submit" value="Submit" class="btn btn-primary" />                                                
                                        </p>
                                    </div>
                                </div>
	                        </div>
	                    </form>
                    </div>
                </div>
                {/* <div class="powered-by-lable"> Powered by: </div>
                <div class="powered-by-logo-box">
                    <img src="/static/images/A1AbilitiesLogo.jpeg" alt="A1abilities" class="powered-by-logo" />
                </div> */}
            </section>
            {isLoading ?   <CallLoader />   : null  }
        </Fragment>
    )
}