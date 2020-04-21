// import { validString, validNumber, validEmail } from './Regex';

export default function validate(values) {
  let errors = {};


  if (!values.comment) {
    errors.comment = 'Comment is required';
  }

  // if (!values.comment_by) {
  //   errors.comment_by = 'Comment By is required';
  // }

  return errors;
};