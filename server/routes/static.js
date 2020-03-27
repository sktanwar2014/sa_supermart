const express = require('express')
const Router = express.Router();
const Static = require('../controllers/static.js');


Router.route("/getRequiredStaticRecordList").get(Static.getRequiredStaticRecordList);


module.exports = Router;