const express = require('express')
const Router = express.Router();
const UnitsController = require('../controllers/units.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/setNewPacketUnit").post(validateToken, UnitsController.setNewPacketUnit);
Router.route("/setNewUnit").post(validateToken, UnitsController.setNewUnit);

module.exports = Router;