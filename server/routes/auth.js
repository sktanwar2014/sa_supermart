const express = require('express')
const Router = express.Router();
const AUthController = require('../controllers/auth.js');


Router.route("/login").post(AUthController.login);
Router.route("/getUserList").get(AUthController.getUserList);



module.exports = Router;