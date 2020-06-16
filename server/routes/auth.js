const express = require('express')
const Router = express.Router();
const AUthController = require('../controllers/auth.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/login").post(AUthController.login);
Router.route("/register").post(AUthController.register);
Router.route("/activateEmail").get(AUthController.activateEmail);
Router.route("/verifyEmail").post(AUthController.verifyEmail);
Router.route("/verifyUserId").post(AUthController.verifyUserId);


Router.route("/changePassword").post(validateToken, AUthController.changePassword);
Router.route("/getUserList").get(validateToken, AUthController.getUserList);
Router.route("/getClientList").post(validateToken, AUthController.getClientList);
Router.route("/handleClientActivation").post(validateToken, AUthController.handleClientActivation);
Router.route("/resendEmailVarificationLink").post(validateToken, AUthController.resendEmailVarificationLink);




module.exports = Router;