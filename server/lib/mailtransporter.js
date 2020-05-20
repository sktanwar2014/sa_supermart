const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { domainName, mailPass, mailService } = require("../lib/database");

// const mailAccountUser = 'admin@' + domainName
// const mailAccountPass = mailPass

const mailAccountUser = 'donotreply.sarga@gmail.com';
const mailAccountPass = 'sarga123';

const trans = nodemailer.createTransport(smtpTransport({
  service: 'GMAIL',
  // service: mailService,
  tls: { rejectUnauthorized: false },
  auth: {
    user: mailAccountUser,
    pass: mailAccountPass
  }
}))


module.exports = { trans: trans };
