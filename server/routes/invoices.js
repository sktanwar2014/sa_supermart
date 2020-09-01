const express = require('express');
const Router = express.Router();
const InvoiceController = require('../controllers/invoices.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/getInvoiceList").post(validateToken, InvoiceController.getInvoiceList);
Router.route("/getItemsForUpdateRequest").post(validateToken, InvoiceController.getItemsForUpdateRequest);
Router.route("/postItemUpdateRequest").post(validateToken, InvoiceController.postItemUpdateRequest);
Router.route("/postInvoiceUpdateRequest").post(validateToken, InvoiceController.postInvoiceUpdateRequest);
Router.route("/payInvoiceBill").post(validateToken, InvoiceController.payInvoiceBill);


module.exports = Router;