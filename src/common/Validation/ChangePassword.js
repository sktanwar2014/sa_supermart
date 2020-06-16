import { validString, validNonSpaceString, passwordRegex, validNumber, validFullLengthDecimalNumber, validEmail, validAlpha } from './Regex';


export default function validate(values) {
    let errors = {};  
  
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