const express = require('express');
const Router = express.Router();
const SettingsController = require('../controllers/settings.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/getSettings").post(validateToken, SettingsController.getSettings);
Router.route("/updateAutomationSettings").post(validateToken, SettingsController.updateAutomationSettings);


module.exports = Router;