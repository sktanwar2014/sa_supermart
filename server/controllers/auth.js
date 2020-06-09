const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const handlebars = require('handlebars');
const path = require('path');

const {readHTMLFile} = require('../utils/utils.js');
const Auth = require('../models/auth.js');
const Miscellaneious = require('../lib/miscellaneous.js');
const { trans } = require("../lib/mailtransporter");
const {domainName, mailUser} = require("../lib/database");


const login = async function (req, res, next) {
    const params = {
        user_id: req.body.username,
        password: req.body.password,
    }
    
    let result = {};
    let status = 200;

    try {
        const newActivity = new Auth(params);
        const users = await newActivity.login();
        const user = users[0];
        
        if (users && users.length > 0) {
            if(user.is_mail_verified === 0 && user.status === 0){
                status = 401;
                result.errorCode = status;
                result.message = `Account is not verified, check your email.`;
            } else if (user.status === 0) {
                status = 401;
                result.errorCode = status;
                result.message = `Account is not activate, please contact to administrator.`;
            }else{
                const payload = { id: user.id, name: user.name, user_id: user.user_id, role: user.role_id, account_id : user.account_id };
                const options = { expiresIn: '12h', issuer: 'https://sargatechnology.com' };
                const secret = process.env.JWT_SECRET || 'secret';
                const token = jwt.sign(payload, secret, options);

                result.token = token;
                result.status = status;
                result.id = user.id;
                result.name = user.name;
                result.role_id = user.role_id;
                result.user_id = user.user_id;
                result.account_id = user.account_id;
            }
            res.status(status).send(result);
        } else {
            status = 401;
            result.errorCode = status;
            result.message = 'User id or password is incorrect.';
            res.status(status).send(result);
        }
    } catch (err) {
        next(err);
    }
}


const register = async function (req, res, next) {
    const params = {
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        mobile : req.body.mobile,
        email : req.body.email,
        user_id : req.body.user_id,
        password : req.body.password,
        accountId : Miscellaneious.generateAccountId(),
		token : Miscellaneious.generateRandomToken(),
    }
    
    try {
        const newActivity = new Auth(params);
        const result = await newActivity.register();

        if(result !== "" && result !== null && result !== undefined){
            
            let url = 'http://' + domainName + '/auth/activateEmail?accountId=' + params.accountId + '&name=' + params.user_id + '&token=' + params.token;
            let filePath = path.join(__dirname, '..', '/templates/accountVerificatoin.html');

            const replacements = {
                username: params.firstname,
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
                    replyTo : mailUser,
                    subject: 'Please verify your email address',
                    text: 'Hi ' + params.firstname + ', click to verify mail',
                    html: finalHtmlPage,
                }
                
                trans.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            });

            res.send( {isRegistered: true} );
        }else{
            res.send( {isRegistered: false} );
        }
    } catch (err) {
        next(err);
    }
}


const getUserList = async function (req, res, next) {
    try {
        const result = await new Auth({}).getUserList();
        res.send( {userList: result} );
    } catch (err) {
        next(err);
    }
}


const getClientList = async function (req, res, next) {
    const params = {
        pageNo : Number(req.body.pageNo),
        // isActive : Number(req.body.is_active),
    }
    try {
        const result = await new Auth(params).getClientList();
        const counts = await new Auth(params).getTotalClientsCount();
        
        res.send( {clientList: result, totalCount: counts[0].total_client } );
    } catch (err) {
        next(err);
    }
}



const handleClientActivation = async function (req, res, next) {
    const params = {
        user_id : req.body.user_id,
        status : req.body.status === 1 ? 0 : 1,
    }
    try {
        const result = await new Auth(params).handleClientActivation();
        if(result !== 0){
            res.send(true);
        }else{
            res.send(false);
        }        
    } catch (err) {
        next(err);
    }
}


const verifyEmail = async function (req, res, next) {
    try {
        const result = await new Auth({email : req.body.email}).verifyEmail();
        if(result !== "" && result.length > 0 && result !== null && result !== undefined){
            res.send( {isExist: true} );
        }else{
            res.send( {isExist: false} );
        }        
    } catch (err) {
        next(err);
    }
}



const verifyUserId = async function (req, res, next) {    
    try {
        const result = await new Auth({user_id : req.body.user_id}).verifyUserId();
        if(result !== "" && result.length > 0 && result !== null && result !== undefined){
            res.send( {isExist: true} );
        }else{
            res.send( {isExist: false} );
        }  
    } catch (err) {
        next(err);
    }
}

const activateEmail = async function (req, res, next) {
    const params = {
        accountId : req.query.accountId,
        user_id : req.query.name,
        token : req.query.token,
    }
    try {
        const activity = new Auth(params);
        const result = await activity.activateEmail();
        if(result !== 0){
            res.status(200).json({ message: "You email successfully verified. Now you can login into application." });
        }else{
            res.status(404).json({ message: "Invalid token" })
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login : login,
    register : register,
    getUserList : getUserList,
    verifyEmail : verifyEmail,
    verifyUserId : verifyUserId,
    activateEmail : activateEmail, 
    getClientList : getClientList,
    handleClientActivation : handleClientActivation,
};
