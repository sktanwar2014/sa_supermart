const express = require('express');
const Router = express.Router();
const InvoiceController = require('../controllers/invoices.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/getInvoiceList").post(validateToken, InvoiceController.getInvoiceList);
Router.route("/getItemsForUpdateRequest").post(validateToken, InvoiceController.getItemsForUpdateRequest);


module.exports = Router;