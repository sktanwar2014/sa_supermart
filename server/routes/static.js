const express = require('express')
const Router = express.Router();
const Static = require('../controllers/static.js');


Router.route("/getProductUnitList").get(Static.getProductUnitList);
Router.route("/getOrderStatusList").get(Static.getOrderStatusList);
Router.route("/getMainUnitRelateRecords").post(Static.getMainUnitRelateRecords);


module.exports = Router;