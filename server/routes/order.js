const express = require('express')
const Router = express.Router();
const Order = require('../controllers/order.js');


Router.route("/getOrderList").post(Order.getOrderList);
Router.route("/proceedToDelivered").post(Order.proceedToDelivered);

module.exports = Router;