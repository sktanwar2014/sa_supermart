const express = require('express');
const Router = express.Router();
const InvoiceController = require('../controllers/invoices.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/getInvoiceList").post(validateToken, InvoiceController.getInvoiceList);
Router.route("/getItemsForUpdateRequest").post(validateToken, InvoiceController.getItemsForUpdateRequest);
Router.route("/postItemUpdateRequest").post(validateToken, InvoiceController.postItemUpdateRequest);
Router.route("/postInvoiceUpdateRequest").post(validateToken, InvoiceController.postInvoiceUpdateRequest);
Router.route("/payInvoiceBill").post(validateToken, InvoiceController.payInvoiceBill);
Router.route("/getTransactionDetails").post(validateToken, InvoiceController.getTransactionDetails);
Router.route("/getItemsToHandleRequest").post(validateToken, InvoiceController.getItemsToHandleRequest);
Router.route("/handleReqestRejection").post(validateToken, InvoiceController.handleReqestRejection);
Router.route("/handleInvoiceToAcceptRequest").post(validateToken, InvoiceController.handleInvoiceToAcceptRequest);
Router.route("/downloadOrderInvoiceVersion").post(validateToken, InvoiceController.downloadOrderInvoiceVersion);



module.exports = Router;