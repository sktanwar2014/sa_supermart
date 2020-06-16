const express = require('express')
const Router = express.Router();
const Order = require('../controllers/order.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/getOrderList").post(validateToken, Order.getOrderList);
Router.route("/getCustomerOrderList").post(validateToken, Order.getCustomerOrderList);

Router.route("/addNewOrder").post(validateToken, Order.addNewOrder);
Router.route("/fetchPreviousBillingAddresss").post(validateToken, Order.fetchPreviousBillingAddresss);
Router.route("/removeSelectedAddress").post(validateToken, Order.removeSelectedAddress);
Router.route("/getOrderedProductList").post(validateToken, Order.getOrderedProductList);
Router.route("/generatePDFOfOrderedProducts").post(validateToken, Order.generatePDFOfOrderedProducts);
Router.route("/getOrderedProductListSingleDay").post(validateToken, Order.getOrderedProductListSingleDay);
Router.route("/getOrderListOfSingleDay").post(validateToken, Order.getOrderListOfSingleDay);
Router.route("/handlePurchasedRecord").post(validateToken, Order.handlePurchasedRecord);
Router.route("/fetchDeliveryFormData").post(validateToken, Order.fetchDeliveryFormData);
Router.route("/submitDeliveryDetails").post(validateToken, Order.submitDeliveryDetails);
Router.route("/handleOrderConfirmation").post(validateToken, Order.handleOrderConfirmation);
Router.route("/orderVerificationByCustomer").post(validateToken, Order.orderVerificationByCustomer);
Router.route("/generateInvoice").post(validateToken, Order.generateInvoice);



module.exports = Router;