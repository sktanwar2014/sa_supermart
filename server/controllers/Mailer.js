const {domainName, mailUser} = require("../lib/database");
const {readHTMLFile} = require('../utils/utils.js');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const path = require('path');
const { trans } = require("../lib/mailtransporter");


const emailVerificationMail = async function (params) {
    try{
        return new Promise(function (resolve, reject) {
        let url = 'http://' + domainName + '/auth/activateEmail?accountId=' + params.account_id + '&name=' + params.user_id + '&token=' + params.token;
        let filePath = path.join(__dirname, '..', '/templates/accountVerificatoin.html');

        const replacements = {
            username: params.name,
            userid : params.user_id,
            password : params.password,
            activationLink : url,
        };

        readHTMLFile(filePath, (err, html) => {
            const template = handlebars.compile(html);
            const finalHtmlPage = template(replacements);
            
            const mailOptions = {                    
                from : `"SA Supermart" <${mailUser}>`,
                to: params.email,
                subject: 'Please verify your email address',
                text: 'Hi ' + params.name + ', click to verify mail',
                html: finalHtmlPage,
            }
            
            trans.sendMail(mailOptions, (err, info) => {
                if (err) {  console.log("Error...", err); reject(err);  }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                resolve(info);
            });            
        });
    });
    }catch(e){ console.log("Error...", e); }
}
    
module.exports = {
    emailVerificationMail : emailVerificationMail,
}

          
