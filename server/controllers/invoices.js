const Invoices = require('../models/Invoices.js');
const {isNotEmpty} = require('../utils/conditionChecker.js');
// const invoiceReport  = require('../reports/generateInvoice.js')
// const orderInvoiceLatestVersion  = require('../reports/orderInvoiceLatestVersion.js');
// const generateOrderedProductReport  = require('../reports/generateOrderedProductReport.js')
// const generatePurchasedItemCostReport  = require('../reports/generatePurchasedItemCostReport.js')
const {isNullOrUndefined} = require('util');


const getInvoiceList = async function (req, res, next) {    
    const params = {
        status: req.body.status,
        from_date :  req.body.from_date,
        to_date :  req.body.to_date,
        searchText: req.body.searchText,
        userId: req.decoded.id,
        userRole: req.decoded.role,
    }
    console.log(params)
    try {
        const Model = new Invoices(params);
        const invoiceList = await Model.getInvoiceList();
        res.send({ invoiceList: invoiceList});
    } catch (err) {
        next(err);
    }
}



const getItemsForUpdateRequest = async function (req, res, next) {    
    const params = {
        // userId: req.decoded.id,
        // userRole: req.decoded.role,
        invoice_id: req.body.invoice_id,
        invoice_version_id: req.body.invoice_version_id,
    }
    console.log(params)
    try {
        const Model = new Invoices(params);
        const itemList = await Model.getItemsForUpdateRequest();
        res.send({ itemList: itemList});        
    } catch (err) {
        next(err);
    }
}





module.exports = {    
    getInvoiceList: getInvoiceList,
    getItemsForUpdateRequest: getItemsForUpdateRequest,
};