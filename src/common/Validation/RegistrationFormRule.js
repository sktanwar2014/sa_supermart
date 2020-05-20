import { validString, validNonSpaceString, passwordRegex, validNumber, validFullLengthDecimalNumber, validEmail, validAlpha } from './Regex';


export default function validate(values) {
    let errors = {};  
  
    if (!values.firstname) {
        errors.firstname = 'First name is missing';
    } else if (!validString.test(values.firstname)) {
        errors.firstname = 'First Name is invalid';
    }
    
    
    if (!values.lastname) {
        errors.lastname = 'Last name is missing';
    }  else if (!validString.test(values.lastname)) {
        errors.lastname = 'Last Name is invalid';
    }


    if (!values.mobile) {
        errors.mobile = 'Mobile number is missing';
    } else if (!validNumber.test(values.mobile)) {
        errors.mobile = 'Mobile number is invalid';
    } else if ((values.mobile).length<9 || (values.mobile).length > 12) {
        errors.mobile = 'Mobile number is invalid';
    }
    

    if (!values.email) {
        errors.email = 'Email Address is missing';
    }  else if (!validEmail.test(values.email)) {
        errors.email = 'Email Address is invalid';
    }  else if(values.email_verification === true ){
        errors.email = 'Email already registered';
    }



    if (!values.userId) {
        errors.userId = 'User id is missing';
    }  else if(!validNonSpaceString.test(values.userId)) {
        errors.userId = 'Invalid user id.';
    }  else if(values.userId_verification === true ){
        errors.userId = 'User id already exist';
    }

    
    if (!values.password) {
        errors.password = 'Password is missing';
    } else if (!passwordRegex.test(values.password)) {
        errors.password = 'Password is invalid';
    }

    if (!values.confirmpassword) {
        errors.confirmpassword = 'Confirm password is missing';
    } else if (!passwordRegex.test(values.password)) {
        errors.confirmpassword = 'Confirm Password is invalid';
    } else if ((values.password) !== (values.confirmpassword)) {
        errors.confirmpassword = 'Confirm Password not match';
    }

    

    
    
    return errors;
  };