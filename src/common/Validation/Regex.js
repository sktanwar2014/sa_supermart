export const validString = /^[a-zA-Z\s]+$/;
export const validNonSpaceString = /^\S+$/;

export const validNumber = /^[0-9]*$/;
export const validDecimalNumber = /^\d{0,2}(\.\d{1,2})?$/;
export const validFullLengthDecimalNumber = /^\d+(\.\d{1,2})?$/;
export const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const validAlpha = /^[a-zA-Z0-9\s]+$/;
export const validAlphaNumericwithDot = /^[\.a-zA-Z0-9\s]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;