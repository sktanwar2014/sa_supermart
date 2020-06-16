import React, {useState, Fragment} from 'react';

// Components
import {APP_TOKEN} from '../../api/config/Constants';
import AuthAPI from '../../api/auth.js'; 
import {LinkAlert} from  '../../common/Alert.js';
import CallLoader from '../../common/Loader.js';
import validate from '../../common/Validation/ChangePassword.js';

const RESET_VALUES = {
    password : '',
    confirmpassword : '',
};

export default function ChangePassword(props){
    const [inputs, setInputs] = useState(RESET_VALUES);
    const [errors, setErrors] = useState(RESET_VALUES);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRegisteredMsg, setShowRegisteredMsg] = useState(false);
    const [alertParams, setAlertParams] = useState({});

    
    const handleInputChange  = (props) => {
      setInputs({...inputs, [props.target.name]: props.target.value});
    }
    
    const handleCancel = () => {
        window.location.pathname = '/';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = await validate(inputs);
        setErrors(errors);

        if(Object.values(errors).length === 0){
            setIsLoading(true);
            setIsSubmitting(true);
            try{
                const result = await AuthAPI.changePassword({
                    password : inputs.password,
                });
                let alertParam = {};
                if(result.isUpdated === true){
                    APP_TOKEN.remove();
                    alertParam.message1 = "Your password has been changed successfully. Use your new password to";
                    alertParam.message2 = ".";
                    alertParam.link = '/login';
                    alertParam.linkText = " Login";
                    alertParam.variant = "info";
                }else{
                    alertParam.message1 = "Operation";
                    alertParam.message2 = "";
                    alertParam.link = '';
                    alertParam.linkText = "";
                    alertParam.variant = "warning";
                }
                setAlertParams(alertParam);
                setInputs(RESET_VALUES);
                setShowRegisteredMsg(true);
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
                <div className= "signup-container w-60">
                    <div className="signup-form-div w-100">
                        <form onSubmit={handleSubmit} class="billing-form">
						    <div style={{margin: "15px 0px"}}>
                                <h5 className="create-account">Change Password </h5>
                                <hr />
                            </div>
	          	            <div class="row align-items-end" style={{margin: "48px 60px"}}>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="password">New Password *</label>
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
                                        <label for="confirmpassword">Confirm new password *</label>
                                        <input type="password" name="confirmpassword" id="confirmpassword" class="signup-form-control" value={inputs.confirmpassword} onChange={handleInputChange} />
                                        <input type="text" value={errors.confirmpassword} disabled  className={errors.confirmpassword ? "error-input d-block" : "error-input d-none" } />
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <p style={{float :"right"}}>
                                            <button type="button" class="btn btn-primary m-10" onClick={handleCancel}>Cancel</button>
                                            <button type="submit" class="btn btn-primary" disabled={isSubmitting} >Submit</button>
                                        </p>
                                    </div>
                                </div>
                                {showRegisteredMsg ? 
                                    <LinkAlert {...alertParams} /> 
                                : null}
	                        </div>
	                    </form>
                    </div>
                </div>
            </section>
            {isLoading ?   <CallLoader />   : null  }
        </Fragment>
    )
}