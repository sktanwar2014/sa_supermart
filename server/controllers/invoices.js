const Invoices = require('../models/Invoices.js');
const Common = require('../models/common.js');
const {isNotEmpty} = require('../utils/conditionChecker.js');
const {uploadDocument} = require('../utils/uploadDocument.js');
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
    // console.log(params)
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
    // console.log(params)
    try {
        const Model = new Invoices(params);
        const itemList = await Model.getItemsForUpdateRequest();
        res.send({ itemList: itemList});        
    } catch (err) {
        next(err);
    }
}



const postItemUpdateRequest = async function (req, res, next) {    
    const params = {
        invoice_item_id : req.body.itemData.id,
        quantity: req.body.itemData.new_quantity,
        unit_id: req.body.itemData.unit_id,
        comment: req.body.itemData.comment,
        total: req.body.itemData.new_total_amt,
        created_by : req.decoded.id,
    }
    // console.log(params)
    try {
        const Model = new Invoices(params);
        const result = await Model.postItemUpdateRequest();
        if(result.insertId > 0){
            res.send({ isUpdated: true});
        }else{
            res.send({ isUpdated: false});
        }
    } catch (err) {
        next(err);
    }
}


const postInvoiceUpdateRequest = async function (req, res, next) {    
    const params = {
        itemList: req.body.itemList,
        invoice_version_id: req.body.invoice_version_id,
        created_by : req.decoded.id,
        comment: req.body.commonComment,
        commentType: 1,
        tableId: req.body.invoice_version_id,        
    }
    // console.log(params)
    try {
        const Model = new Invoices(params);
        const CommonModal = new Common(params);
        
        let items = [];
        let invoiceItemIds = [];
        Object.values(params.itemList).map((data, index) => {
            invoiceItemIds.push(data.id);
            items.push([data.id, data.new_quantity, data.unit_id, data.new_total_amt, data.comment, 1, params.created_by ]);
        });
        
        CommonModal.tableName = 'invoice_versions';
        const commentResult = await CommonModal.postComment();
        
        if(params.itemList.length > 0 && items.length > 0){
            const result = await Model.postInvoiceUpdateRequest(items, invoiceItemIds.join(','));
        }
        
        Model.status = 3;
        const result = await Model.updateInvoiceVersionStatus();
        
        res.send({ isUpdated: true });
    } catch (err) {
        next(err);
    }
}




const payInvoiceBill = async function (req, res, next) {
    let docName = '';
    if(req.body.document !== ""){
        const base64Data = req.body.document.data.split(';base64,').pop();
        docName = req.body.document.name.split('.')[0] + "_" + Date.now() + '.' + req.body.document.name.split('.')[1];
        docName = docName.replace(/\s/g, '');
        await uploadDocument(`./files/transactionReceipt/${docName}`, base64Data).catch(error => {
            console.error(error);
            throw (error);
        });
    }

    const params = {
        created_by : req.decoded.id,
        invoice_version_id: req.body.invoice_version_id,
        invoice_id: req.body.invoice_id,
        invoice_billing_id: req.body.invoice_billing_id,
        transaction_id: req.body.transaction_id,
        status: 2,
        documentName: docName,
    };
    try {        
        const Model = new Invoices(params);        

        await Model.updateInvoiceVersionStatus();
        const result = await Model.payInvoiceBill();        
        

        if(req.body.document !== ""){
            const CommonModal = new Common(params);
            CommonModal.tableId = result.insertId;
            CommonModal.tableName = 'invoice_transactions';
            CommonModal.docType = 2;

            await CommonModal.insertDocumentEntry();
        }
        
        res.send({ isUpdated: true });
    } catch (err) {
        next(err);
    }
}


module.exports = {    
    getInvoiceList: getInvoiceList,
    getItemsForUpdateRequest: getItemsForUpdateRequest,
    postItemUpdateRequest: postItemUpdateRequest,
    postInvoiceUpdateRequest: postInvoiceUpdateRequest,
    payInvoiceBill: payInvoiceBill,
};