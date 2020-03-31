const express = require('express')
const Router = express.Router();
const Order = require('../controllers/order.js');


Router.route("/getOrderList").post(Order.getOrderList);
Router.route("/getCustomerOrderList").post(Order.getCustomerOrderList);

Router.route("/proceedToDelivered").post(Order.proceedToDelivered);
Router.route("/addNewOrder").post(Order.addNewOrder);


module.exports = Router;