const moment = require('moment');

export function getDate(date) {
  return moment(date).format("YYYY-MM-DD");
}

function getCurrentDateDBFormat() {
  return moment().format("YYYY-MM-DD")
}


function getCurrentDate() {
  return moment().format("MM/DD/YYYY")
  
}


function getCurrentDateInYYYYMMDD() {
  return moment().format("YYYY/MM/DD")
}

export function getDateInDDMMYYYY(date) {
  return moment(date).format("DD-MM-YYYY")
}

 function getCurrentDateDDMMYYYY() {
  return moment().format("DD-MM-YYYY")
}

function getTimeinDBFormat(date) {
  return moment(date).format("HH:mm:ss")
}

function getTime(date) {
  return moment(date).format("HH:mm")
}

function convertDateInUTC(date) {  
  return moment.utc(date);  
}

function setDBDateFormat(date){
  let day = date.split('-')[0];
  let month = date.split('-')[1];
  let year = date.split('-')[2];
  return (year + '-' + month + '-' + day) ;
}

function isBirthDate(date){
  const custDate = new Date(date);
  const currDate = new Date();
  return (custDate.getDate() === currDate.getDate() && custDate.getMonth() === currDate.getMonth());
}


function addOneDay(date){
  return moment(date).add(1, 'days').format("YYYY-MM-DD");  
}

function subtractOneDay(date){
  return moment(date).subtract(1, 'days').format("YYYY-MM-DD");  
}

function checkPastDate(date) {  
  return moment(date).format("YYYY-MM-DD") > getDate();
}

function checkFutureDate(date) {
  return moment(date).format("YYYY-MM-DD") < getDate();
}

function isSameDate(payment_date, settlement_date) {
  console.log(payment_date === settlement_date, payment_date, settlement_date)
  console.log(moment(payment_date) > moment(settlement_date), moment(payment_date) < moment(settlement_date))
  return payment_date === settlement_date;
}

function checkOverDue(payment_date, settlement_date) {  
  return moment(payment_date).format("YYYY-MM-DD") > moment(settlement_date).format("YYYY-MM-DD");
}

function escapeSunday(date){
  return moment(date).format("dddd") == "Sunday";
}
