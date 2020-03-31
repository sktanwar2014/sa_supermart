import React, {useState} from 'react';

// Components
import {APP_TOKEN} from '../../api/config/Constants';
import AuthAPI from '../../api/auth.js';

export default function Login(props){
    APP_TOKEN.remove();
    
    const history = props.history;
    const [inputs, setInputs] = useState({username:'', password: ''});

    const handleChange  = (props) => {
      setInputs({...inputs, [props.target.name]: props.target.value});
    }
 
    const handleLogin = async () => {
        if(inputs.username !== '' && inputs.password !== ''){
            try{      
            const result = await AuthAPI.login({
                username: inputs.username,
                password: inputs.password,
            });
            if(result.length !== undefined && result.length >0){
                APP_TOKEN.set(result[0]);
                history.push('/');
            }else{
                alert('Invalid Credentials');
            }
        }catch(e){
            console.log('Error...',e);
            }
       }else{
            alert('Fill the details');
        }
    }

    return(
        <section className="login_form_inner">
            <div className="container">
                <div className="row">           
                    <div className="col-md-12">
                        <h3>Log in to enter</h3>
                        <div className="bg-white p-5 contact-form">
                        <div className="form-group">
                            <input type="text" className="form-control login_form_input" placeholder="Username" name="username" onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control login_form_input" placeholder="Password" name="password" onChange={handleChange} required/>
                        </div>
                        <div className="form-group" style={{marginTop:'30px'}}>
                            <button type="submit" value="submit" className="btn submit_btn" onClick={handleLogin}>Log In</button>
                        </div>
                        {/* <div className="form-group" style={{marginTop:'30px'}}>
                            <a href="#"  style={{marginTop:'30px'}}>Forgot Password?</a>
                        </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}