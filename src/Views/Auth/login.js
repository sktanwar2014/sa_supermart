import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
// Components
import {APP_TOKEN} from '../../api/config/Constants';
import AuthAPI from '../../api/auth.js';

import {SimpleAlert} from  '../../common/Alert.js';
import CallLoader from '../../common/Loader.js';


export default function Login(props){
    APP_TOKEN.remove();
    const isTokenSource = axios.CancelToken.source();
    
    const history = props.history;
    const [inputs, setInputs] = useState({username:'', password: ''});
    const [isInvalideCredentials, setIsInvalideCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    

    const handleChange  = (props) => {
      setInputs({...inputs, [props.target.name]: props.target.value});
      setIsInvalideCredentials(false);
    }
    
    // useEffect(()=>{
    //     isTokenSource.cancel('API Cancel');
    // },[]);
    
 
    const handleLogin = async (e) => {
            e.preventDefault();
            setIsLoading(true);
        try{
            const result = await AuthAPI.login({
                cancelToken : isTokenSource.token,
                username: inputs.username,
                password: inputs.password,
            });
            setIsLoading(false);
            APP_TOKEN.set(result);
            history.push('/');
        }catch(error){
            const { message, errorCode } = error.response.data;
            setErrorMessage(message);
            setIsInvalideCredentials(true);
            setIsLoading(false);
        }
    }

    return(
        <Fragment>
            <section className="login-section">
                {/* <img src="/images/bg_1.jpg" alt="app logo" class="login-logo"  /> */}
                <p className="login-title">SA SUPERMART</p>
                    <form className="login-form" onSubmit= {handleLogin}>
                        <div className="login-input-div">
                            <div class="input-div">
                                <input type="text" className="login-inputs" placeholder="Username" name="username" onChange={handleChange} required/>
                            </div>
                        </div>
                        <div className="login-input-div">
                            <div class="input-div">
                                <input type="password" className="login-inputs" placeholder="Password" name="password" onChange={handleChange} required/>
                            </div>
                        </div>
                        <div className="login-input-div" >
                            {/* <p class="forgot-password">
                                <a href="/forgotPassword">Forgot Password?</a>
                            </p> */}
                            <button type="submit" className="btn submit_btn">Log In</button>
                        </div>
                        {isInvalideCredentials ? <SimpleAlert message={errorMessage} variant="danger" style = {{padding:'0px', paddingLeft:'10px', marginTop:'10px'}}/> : ""}
                        <div className="m-top-15">
                            <p class="sign-up"> Don't have an account? <a href="/sign-up">Sign up</a></p>
                            <hr />
                        </div>
                        
                    </form>
                    <div class="powered-by-lable"> Powered by: </div>
                    <div class="powered-by-logo-box">
                        <img src="/static/images/A1AbilitiesLogo.jpeg" alt="A1abilities" class="powered-by-logo" />
                    </div>
            </section>
            {isLoading ?   <CallLoader />   : null  }
        </Fragment>
    )
}