const express = require('express')
const Router = express.Router();
const Static = require('../controllers/static.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/getProductUnitList").get(validateToken, Static.getProductUnitList);
Router.route("/getOrderStatusList").get(validateToken, Static.getOrderStatusList);
Router.route("/getMainUnitRelateRecords").post(validateToken, Static.getMainUnitRelateRecords);
Router.route("/getMeasuredUnitofProduct").post(validateToken, Static.getMeasuredUnitofProduct);


module.exports = Router;