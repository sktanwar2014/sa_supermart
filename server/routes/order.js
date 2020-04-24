const express = require('express')
const Router = express.Router();
const Order = require('../controllers/order.js');


Router.route("/getOrderList").post(Order.getOrderList);
Router.route("/getCustomerOrderList").post(Order.getCustomerOrderList);

Router.route("/addNewOrder").post(Order.addNewOrder);
Router.route("/fetchPreviousBillingAddresss").post(Order.fetchPreviousBillingAddresss);
Router.route("/removeSelectedAddress").post(Order.removeSelectedAddress);
Router.route("/getOrderedProductList").post(Order.getOrderedProductList);
Router.route("/getOrderedProductListSingleDay").post(Order.getOrderedProductListSingleDay);
Router.route("/getOrderListOfSingleDay").post(Order.getOrderListOfSingleDay);
Router.route("/handlePurchasedRecord").post(Order.handlePurchasedRecord);
Router.route("/fetchDeliveryFormData").post(Order.fetchDeliveryFormData);
Router.route("/submitDeliveryDetails").post(Order.submitDeliveryDetails);
Router.route("/handleOrderConfirmation").post(Order.handleOrderConfirmation);
Router.route("/orderVerificationByCustomer").post(Order.orderVerificationByCustomer);



module.exports = Router;