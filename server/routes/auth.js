const express = require('express')
const Router = express.Router();
const AUthController = require('../controllers/auth.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/login").post(AUthController.login);
Router.route("/register").post(AUthController.register);
Router.route("/activateEmail").get(AUthController.activateEmail);
Router.route("/verifyEmail").post(AUthController.verifyEmail);
Router.route("/verifyUserId").post(AUthController.verifyUserId);


Router.route("/getUserList").get(validateToken, AUthController.getUserList);




module.exports = Router;