const express = require('express')
const Router = express.Router();
const UnitsController = require('../controllers/units.js');


Router.route("/setNewPacketUnit").post(UnitsController.setNewPacketUnit);
Router.route("/setNewUnit").post(UnitsController.setNewUnit);

module.exports = Router;