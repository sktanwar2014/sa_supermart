const Order = require('../models/order.js');
const Invoices = require('../models/Invoices.js');
const Settings = require('../models/settings.js');
const {isNotEmpty} = require('../utils/conditionChecker.js');
const Static = require('../models/static.js')
const Auth = require('../models/auth.js');
// const invoiceReport  = require('../reports/generateInvoice.js')
const orderInvoiceDocLayout  = require('../reports/orderInvoiceDocLayout.js');
const generateOrderedProductReport  = require('../reports/generateOrderedProductReport.js')
const generatePurchasedItemCostReport  = require('../reports/generatePurchasedItemCostReport.js')
const {isNullOrUndefined} = require('util');
const {sortObject} =require('../utils/objectOperations.js');


function calTotalUnit(unitList, unitId, quantity, mainSequence, mainUnitId ){
    const currUnit = Object.values(unitList).find((unit) => {return unit.id === unitId});
    const finalResult = unitList.map(data => {
        if(data.id === currUnit.id){
            if(currUnit.sequence ===  mainSequence && unitId === mainUnitId){
                return  quantity;
            }else if(currUnit.sequence < mainSequence && currUnit.id !== mainUnitId){
                let newQuantity = quantity / currUnit.equal_value_of_parent;
                return calTotalUnit(unitList, currUnit.parent_id, newQuantity, mainSequence, mainUnitId)
            }else if(currUnit.sequence > mainSequence &&  currUnit.id !== mainUnitId ){
                const belowUnit = Object.values(unitList).find((unit) => {return unit.parent_id === currUnit.id});
                let newQuantity = quantity * belowUnit.equal_value_of_parent;
                return calTotalUnit(unitList, belowUnit.id, newQuantity, mainSequence, mainUnitId)
            }
        }
    });
    return Object.values(finalResult).find(ele => {return (ele !== undefined && ele !== NaN && ele !== null) });
}




const getOrderInvoiceLatestVersion = async function (req, res, next) {
    const params = {
        order_id : req.body.orderId,
    }

    try {
        const Model = new Order(params);
        const InvoiceModel = new Invoices(params);
        const details = await Model.getLastestOrderInvoiceDetails();
        
        InvoiceModel.invoice_id = details.invoice[0].invoice_id;
        InvoiceModel.invoice_version_id = details.invoice[0].invoice_version_id;
        const itemList = await InvoiceModel.getItemsForInvoiceDoc();
        
        let DD = orderInvoiceDocLayout({itemList: itemList, details: details});
        res.send(DD);
    } catch (err) {
        next(err);
    }
}


const getOrderList = async function (req, res, next) {    
    const params = {
        order_status: req.body.order_status,
        from_date :  req.body.from_date,
        to_date :  req.body.to_date,
    }
    try {
        const Model = new Order(params);
        const orderList = await Model.getOrderList();
        res.send({ orderList: orderList});
    } catch (err) {
        next(err);
    }
}


const getOrderListOfSingleDay = async function (req, res, next) {    
    const params = {
        order_status: req.body.order_status,
        date :  req.body.date,
    }
    try {
        const Model = new Order(params);
        const orderList = await Model.getOrderListOfSingleDay();
        // const orderedProducts = await Model.getOrderedProduct();
        res.send({ orderList: orderList });
    } catch (err) {
        next(err);
    }
}


const getCustomerOrderList = async function (req, res, next) {    
    const params = {
        order_status: req.body.order_status,
        createdBy : req.body.createdBy,
        from_date :  req.body.from_date,
        to_date :  req.body.to_date,
    }
    try {
        const Model = new Order(params);
        const orderList = await Model.getCustomerOrderList();  
        res.send({ orderList: orderList});
    } catch (err) {
        next(err);
    }
}




const orderVerificationByCustomer = async function (req, res, next) {    
    const params = {
        formData : req.body.productData,
        orderId : req.body.orderId,
    }
    try {
        const Model = new Order(params);
        
        let deliveredId = [];
        let Values = [];
        Object.values(params.formData).map(async (data, index) => {
            deliveredId.push(data.delivered_id);
            Values.push([params.orderId, data.delivered_id, data.product_id,  data.quantity, data.unit_id, 1]);
        });
        Model.delivered_id = deliveredId.join(',');

        await Model.changeOrderStatus({status: 3, orderId: params.orderId});        
        const result = await Model.orderVerificationByCustomer(Values);        

        if(isNotEmpty(result)){
            res.send(true);
        }else{
            res.send(false);
        }
    } catch (err) {
        next(err);
    }
}

const addNewOrder = async function (req, res, next) {    
    const params = {
        shipping_id : req.body.shipping_id,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        state : req.body.state,
        streetAddress : req.body.streetAddress,
        flatAdd : req.body.flatAdd,
        city : req.body.city,
        postCode : req.body.postCode,
        phone : req.body.phone,
        email : req.body.email,
        order_date : req.body.order_date,
        createdBy : req.body.createdBy,
        // itemsTotal: req.body.itemsTotal,
        cartItems : req.body.cartItems,
    }
    try {
        const Model = new Order(params);
        
        if(!isNotEmpty(params.shipping_id)){
            const shippingId = await Model.insertShippingDetails();
            Model.shipping_id = shippingId;
        }else{
            await Model.updateShippingDetails();
        }
        
        const orderId = await Model.insertOrderDetails();
        Model.order_id = orderId;
        
        let Values = [];
        const result = Object.values(params.cartItems).map(async (data, index) => {
            Values.push([params.createdBy, orderId, `O${orderId}P${data.id}U${data.selected_unit_id}-${Math.floor(Math.random()*10000)}`, data.id, data.quantity, data.selected_unit_id, 1, 1, params.createdBy]);
        });
        await Model.insertOrderedProduct(Values);

        if(result !== null && result !== undefined && result !== ""){
            res.send(true);
        }else{
            res.send(false);
        }
    } catch (err) {
        next(err);
    }
}



const fetchPreviousBillingAddresss = async function (req, res, next) {    
    const params = {
       userId : req.body.userId
    }
    try {
        const Model = new Order(params);
        const result = await Model.fetchPreviousBillingAddresss();
        res.send({billingAddresses: result});
    } catch (err) {
        next(err);
    }
}



const removeSelectedAddress = async function (req, res, next) {    
    const params = {
       id : req.body.id,
       userId : req.body.userId
    }
    try {
        const Model = new Order(params);
        await Model.removeSelectedAddress();

        const result = await Model.fetchPreviousBillingAddresss();

        res.send({billingAddresses: result});
    } catch (err) {
        next(err);
    }
}



const fetchDeliveryFormData = async function (req, res, next) {    
    const params = {
       orderId : req.body.orderId, 
       order_date : req.body.order_date,
    }
    try {
        const Model = new Order(params);
        const result = await Model.fetchDeliveryFormData();

        if(isNotEmpty(result)){
            res.send(result);
        } else{
            res.send({deliveryFormData: [], extraPurchased: []});
        }
    } catch (err) {
        next(err);
    }
}

const handlePurchasedRecord = async function (req, res, next) {
    const params = {
        formData : req.body.formData,
    }    
    try {
        const Model = new Order(params);
        
        Object.values(params.formData).map(async (data) => {
            const result = await Model.handlePurchasedRecord(data);
            const result2 = await Model.updateProductPrice(data);
        });

        res.send({isEmpty: false});
    } catch (err) {
        next(err);
    }
}


const getOrderedProductListSingleDay = async function (req, res, next) {
    const params = {
        date :  req.body.date,
        operation: req.body.operation,
    }
    try {
     
        const Model = new Order(params);
        const result = await Model.getOrderedProductListSingleDay();
        const purchaseRecord = await Model.getDailyPurchaseRecords();
        const staticRecords = await new Static({}).getAllUnitList();
        // console.log(result)
        // console.log(purchaseRecord)
        const prodIds = [...new Set(result.map(dist => dist.product_id))];
        let returnValues  = [];

        prodIds.map((prodId) => {
            const mainUnit = Object.values(result).find((prod) => { return prod.product_id === prodId})
            const unit = Object.values(staticRecords).find((unit) => {return unit.id === mainUnit.main_unit_id});
            const unitList = Object.values(staticRecords).filter((ele) => {return ele.group_id === unit.group_id});                        

            let weight =  0;
            let check = 0;
            let product = {};

            const assignRow = (product, isMain = 0) =>{
                let purchase = {};
                if(isMain === 1){
                    purchase = purchaseRecord.find(ele => {return ele.product_id === product.product_id && (ele.purchased_unit_id === product.main_unit_id)});
                }else{
                    purchase = purchaseRecord.find(ele => {return ele.product_id === product.product_id && (ele.purchased_unit_id === product.unit_id)});
                }
                
                // console.log(purchase)
                let row = {};
                    row.id = product.product_id;
                    row.product_name = product.product_name;
                    row.quantity = product.is_packet === 1 ? product.quantity : weight,
                    row.main_unit_id = product.main_unit_id;
                    row.unit_id = (isMain === 1) ? unit.id : product.unit_id;
                    row.unit_name = (isMain === 1) ? unit.unit_name : product.unit_name;
                    row.main_unit_name = product.main_unit_name;
                    row.sub_category_id = product.sub_category_id;
                    row.category_id = product.category_id;
                    row.price = product.price;
                    row.price_per_unit = product.price_per_unit;
                if(isNotEmpty(purchase)){
                    row.purchased_quantity = purchase.purchased_quantity;
                    row.purchased_unit_id = purchase.purchased_unit_id;
                    row.cost = purchase.cost;
                    row.cost_of_each = purchase.cost_of_each;
                    row.purchased_status = purchase.status;
                    row.is_extra = purchase.is_extra;
                }else{
                    row.purchased_quantity = '';
                    row.purchased_unit_id = '';
                    row.cost = '';
                    row.cost_of_each = '',
                    row.purchased_status = '';
                    row.is_extra = 0;
                }
                // console.log(row)

                returnValues.push(row);
            }

            
            Object.values(result).map((prod) => {
                if(prodId === prod.product_id){
                    // console.log(prod, prodId, prod.product_id, prod.is_packet, mainUnit.main_unit_id, prod.unit_id)
                    if(prod.is_packet === 0){
                        // if(mainUnit.main_unit_id === prod.unit_id) {
                            product = prod;
                        // }
                        let mainWeight =  calTotalUnit(unitList, prod.unit_id, prod.quantity, unit.sequence, mainUnit.main_unit_id);
                        weight = weight +  mainWeight;
                        check = 1;
                    }else{
                        assignRow(prod);
                    }
                }
            });
            if(check===1){assignRow(product, 1)}
        });
        
        Object.values(purchaseRecord).map(data => {
            let found = prodIds.find(ele=> ele === data.product_id && data.is_extra === 0);
            // console.log(found)
            if(!(found)){
            // console.log(data)

                returnValues.push({
                    id : data.product_id,
                    product_name : data.product_name,
                    quantity : data.required_quantity,
                    main_unit_id: data.main_unit_id,
                    main_unit_name: data.main_unit_name,
                    sub_category_id : data.sub_category_id,
                    category_id : data.category_id,
                    price : data.price,
                    price_per_unit : data.price_per_unit,
                    is_extra : data.is_extra,
                    purchased_quantity : data.purchased_quantity,
                    purchased_unit_id : data.purchased_unit_id,
                    cost : data.cost,
                    cost_of_each : data.cost_of_each,
                    purchased_status : data.status,
                    unit_id : data.purchased_unit_id,
                    unit_name :  data.unit_name,
                });
            }
        })

        // const returns = returnValues.sort((a, b) => {
        //     let v1 = String(a.product_name).toUpperCase();
        //     let v2 = String(b.product_name).toUpperCase();
        //     console.log(v1, v2)
        //     if (v1.region < v2.region)
        //       return -1;
        //     if (v1.region > v2.region)
        //       return 1;
        //     return 0;
        // });
        
         
         
        const returns= returnValues.sort(sortObject('product_name', 'asc'));
        if(params.operation === 'View'){
            res.send({orderedProductListSingleDay: returns}); 
        }else if(params.operation === 'Download'){
            const company = await Model.getCompanyDetails();            
            let DD = generatePurchasedItemCostReport({records: returns, company: company[0], costingDate: params.date});
            res.send(DD);
        }
        
    } catch (err) {
        next(err);
    }
}

const getOrderedProductList = async function (req, res, next) {
    const params = {
        from_date :  req.body.from_date,
        to_date :  req.body.to_date,
        user_ids : req.body.user_ids,
    }
    try {
        const Model = new Order(params);
        const staticRecords = await new Static({}).getAllUnitList();
        const result = await Model.getOrderedProductList();
        
        const prodIds = [...new Set(result.map(dist => dist.product_id))];
        const userIds = [...new Set(result.map(dist => dist.user_id))];
        const subCategoryIdList = [...new Set(result.map(dist => dist.sub_category_id))];
        let returnValues  = [];
    
        prodIds.map((prodId) => {
            const mainUnit = Object.values(result).find((prod) => { return prod.product_id === prodId})
            const unit = Object.values(staticRecords).find((unit) => {return unit.id === mainUnit.main_unit_id});
            const unitList = Object.values(staticRecords).filter((ele) => {return ele.group_id === unit.group_id})
            
            userIds.map((userId) => {
                let weight =  0;
                let product = {};
                Object.values(result).map((prod) => {
                    if(prodId === prod.product_id && userId  ===  prod.user_id){
                        product = prod;
                        let mainWeight =  calTotalUnit(unitList, prod.unit_id, prod.quantity, unit.sequence, mainUnit.main_unit_id);
                        weight = weight +  mainWeight;
                    }
                });

                if(product !== null && product !== undefined && Object.values(product).length > 0){
                    returnValues.push({
                        product_id : product.product_id,
                        user_id : product.user_id,
                        user_name : product.user_name,
                        ordered_unit_id : product.ordered_unit_id,
                        ordered_unit_name : product.ordered_unit_name,
                        ordered_quantity : product.ordered_quantity,
                        product_name : product.product_name,
                        quantity : weight,
                        unit_id: product.main_unit_id,
                        unit_name: unit.unit_name,
                        sub_category_id : product.sub_category_id,
                        sub_category_name: product.sub_category_name,
                    });
                }
            });
        });
        
        res.send({orderedProductList: returnValues, userIdList: userIds, subCategoryIdList: subCategoryIdList });
    } catch (err) {
        next(err);
    }
}



const generatePDFOfOrderedProducts = async function (req, res, next) {
    const params = {
        from_date :  req.body.from_date,
        to_date :  req.body.to_date,
        user_ids : req.body.user_ids,
    }
    try {
        const Model = new Order(params);
        const staticRecords = await new Static({}).getAllUnitList();
        const result = await Model.getOrderedProductList();
        // console.log(result)
        const prodIds = [...new Set(result.map(dist => dist.product_id))];
        const userIds = [...new Set(result.map(dist => dist.user_id))];
        const subCategoryIdList = [...new Set(result.map(dist => dist.sub_category_id))];
        let returnValues  = [];
    
        prodIds.map((prodId) => {
            const mainUnit = Object.values(result).find((prod) => { return prod.product_id === prodId})
            const unit = Object.values(staticRecords).find((unit) => {return unit.id === mainUnit.main_unit_id});
            const unitList = Object.values(staticRecords).filter((ele) => {return ele.group_id === unit.group_id})
            
            userIds.map((userId) => {
                let weight =  0;
                let product = {};
                Object.values(result).map((prod) => {
                    if(prodId === prod.product_id && userId  ===  prod.user_id){
                        product = prod;
                        let mainWeight =  calTotalUnit(unitList, prod.unit_id, prod.quantity, unit.sequence, mainUnit.main_unit_id);
                        weight = weight +  mainWeight;
                    }
                });

                if(product !== null && product !== undefined && Object.values(product).length > 0){
                    returnValues.push({
                        product_id : product.product_id,
                        user_id : product.user_id,
                        login_id : product.login_id,
                        user_name : product.user_name,
                        ordered_unit_id : product.ordered_unit_id,
                        ordered_unit_name : product.ordered_unit_name,
                        ordered_quantity : product.ordered_quantity,
                        product_name : product.product_name,
                        quantity : weight,
                        unit_id: product.main_unit_id,
                        unit_name: unit.unit_name,
                        sub_category_id : product.sub_category_id,
                        sub_category_name: product.sub_category_name,
                    });
                }
            });
        });
        
        const company = await Model.getCompanyDetails();
        let DD = generateOrderedProductReport({
            fromDate: params.from_date, 
            toDate: params.to_date, 
            orderedProductList: returnValues, 
            userIdList: userIds,
            subCategoryIdList: subCategoryIdList,
            companyDetail : company[0]
        });
        
        res.send(DD);
        
    } catch (err) {
        next(err);
    }
}



const submitDeliveryDetails = async function (req, res, next) {  
    const params = {
        formData : req.body.productData,
        orderId : req.body.orderId,        
        createdBy : req.decoded.id,
    }

    let ordered_id = [];
    let deliveredData = [];
    let productId = [];
    let orderDate = [];
    Object.values(params.formData).map(async (data, index) => {
        ordered_id.push(data.ordered_id);
        productId.push(data.product_id);
        orderDate.push(data.order_date);
        deliveredData.push([data.order_id, data.ordered_id, data.product_id, data.tracking_id, data.order_date, data.delivery_date,  data.paid_quantity, data.unit_id, data.price, 2, 1, params.createdBy]);
    });
    try {
        const Model = new Order(params);
        Model.ordered_id = ordered_id.join(',');
        Model.product_id = productId.join(',');
        Model.order_date = orderDate.join('","');
        await Model.changeOrderStatus({status: 2, orderId: params.orderId});
        await Model.proceedToDelivered();
        await Model.submitDeliveryDetails(deliveredData);
        await Model.updatePurchaseRegister();
        
        
        const settings = await new Settings({orderId: params.orderId}).checkUserAutomationSettings(); 
        if(!isNullOrUndefined(settings)){
            if(settings.length > 0){
                if(settings[0].is_active === 1){
                    await Model.changeOrderStatus({status: 3, orderId: params.orderId});
                    const deliveryData = await Model.getDeliveryData();
                    let deliveredId = [];
                    let Values = [];                    
                    Object.values(deliveryData).map(async (data, index) => {
                        deliveredId.push(data.delivered_id);
                        Values.push([params.orderId, data.delivered_id, data.product_id,  data.quantity, data.unit_id, 1]);
                    });
                    
                    Model.delivered_id = deliveredId.join(',');                    
                    await Model.orderVerificationByCustomer(Values);
                }
            }
        }

        res.send(true);
    } catch (err) {
        next(err);
    }
}





const handleOrderConfirmation = async function (req, res, next) {  
    const params = {
        formData : req.body.productData,
        orderId : req.body.orderId,
        customer_type : 1, // Franchise User
        invoice_type : 1, // Franchise invoice  
        customer_id: req.body.customer_id,
        created_by : req.decoded.id,
    }
    
    try {
        const Model = new Order(params);
        let accepted = [];
        let rejected = [];
        
        const result = Object.values(params.formData).map(async (data, index) => {            
            if(data.status == '5'){ // Accepted - accept the changes in product quantity by franchise
                accepted.push(data.delivered_id);
            }else if(data.status == '6'){ // Rejected - reject the changes in product quantity by franchise
                rejected.push(data.delivered_id);
            }
        });
        
        await Model.changeOrderStatus({status: 4, orderId: params.orderId});
        
        if(accepted.length > 0){
            await Model.handleOrderConfirmation({status: 5, delivered_id: accepted.join(',')});
        }
        if(rejected.length > 0){
            await Model.handleOrderConfirmation({status: 6, delivered_id: rejected.join(',')});
        }
        

        
        const itemList = await Model.getItemListForFirstInvoicing();
        
        const InvoiceModel = new Invoices(params);
        const invoiceId = await InvoiceModel.generateInvoice();
        
        InvoiceModel.invoice_id = invoiceId;
        const invoiceVersionId = await InvoiceModel.generateNewVersionOfInvoice();
        
        InvoiceModel.invoice_version_id = invoiceVersionId;       
        
        const itemListValues = [];
        Object.values(itemList).map(async (data, index) => {
            itemListValues.push([invoiceId, invoiceVersionId, 1, data.item_id, data.unit_id, data.item_name, data.unit_name, data.unit_price, data.quantity, data.total_amt, 7, 1]);
        });
        
        await InvoiceModel.generateInvoiceItems(itemListValues);

        InvoiceModel.sub_total = Object.values(itemList).reduce((acc, data, index )=> { return acc + data.total_amt }, 0);
        InvoiceModel.total_subtraction = 0;
        InvoiceModel.total_addition = 0;
        InvoiceModel.total = (InvoiceModel.sub_total + InvoiceModel.total_addition - InvoiceModel.total_subtraction).toFixed(2);

        
        const billingId = await InvoiceModel.generateInvoiceBilling();

        if(isNotEmpty(result)){
            res.send(true);
        }else {
            res.send(false);
        }
    } catch (err) {
        next(err);
    }
}


// async function calculateProductTotalQuantity(products){

//     const prodIds = [...new Set(products.map(dist => dist.product_id))];
//     let returnValues  = [];

//     prodIds.map(prodId => {
//         let units = [];
//         let product =[];
//         let weight =  0;
//         Object.values(products).map((prod) => {
//             if(prodId === prod.product_id){
//                 product = prod;
                
//                 let unit_id = 0;
//                 let weight = 0;
//                 if(prod.is_packet == 1){
//                     unit_id = prod.packet_unit_id;     weight = prod.packet_weight * prod.quantity; 
//                 }else{
//                     unit_id = prod.unit_id;            weight = prod.quantity;  
//                 }

//                 if(units.length == 0){
//                     units.push({id: unit_id, weight: weight, price: prod.price})
//                 }else{
//                     const found = units.find((ele) => {return ele.id == unit_id});
//                     if(found){
//                         let temp = [...units];
//                         temp.map((data, index) => {
//                             if(data.id == unit_id){
//                                 units[index].weight =  units[index].weight + weight;
//                             }
//                         })
//                     }else{
//                         units.push({id: unit_id, weight: weight})
//                     }
//                 }
//             }
//         })

//         units.map(w  => {
//             if(product.main_unit_id === 1 || product.main_unit_id === 3){
//                 if(w.id === 2 || w.id === 4){
//                     weight = weight + (w.weight /1000);
//                 }else if(w.id === 1 || w.id === 3){
//                     weight = weight + w.weight;
//                 }
//             }else if(product.main_unit_id === 2 || product.main_unit_id === 4){
//                 if(w.id === 2 || w.id === 4){
//                     weight = weight  + w.weight;
//                 }else if(w.id === 1 || w.id  === 3){
//                     weight = weight + w.weight * 1000;
//                 }
//             }else if(product.main_unit_id === 5){
//                 if(w.id === 5){
//                     weight = weight  + w.weight;
//                 }
//             }
//         })


//         returnValues.push({
//             id : product.product_id,
//             product_name : product.product_name,
//             weight : weight,
//             main_unit_id: product.main_unit_id,
//             unit_name: product.unit_name,
//             price : product.price,
//         });
//     })
//     return returnValues;
// }


 // 1 KG
        // 2 Box
        // 3 Grams
        // 4 Litre
        // 5 Packet
        // 6 Millilitre
        // 7 Piece


// function check (data, unitList, unit_id, main_unit_id, isChild){
//     let weight = 0;
//     let returnArray = {};
//     const found = unitList.find(ele => ele.id === unit_id);
//     if(found.parent_id === main_unit_id){
//         weight = weight + (data.weight / found.equal_value_of_parent);
//         returnArray.weight = weight;
//         returnArray.is_targeted = 1;
//         returnArray.parent_id = found.parent_id;
//         returnArray.unit_id = found.unit_id;
//     }else if(found.parent_id !== main_unit_id && found.parent_id === 0 && isChild === false){
//         returnArray.weight = weight;
//         returnArray.is_targeted = 0;
//         returnArray.parent_id = 0;
//         returnArray.unit_id = found.unit_id;
//     }else if(found.parent_id !== main_unit_id && found.parent_id !== 0 ){
//         returnArray.weight = (1 / found.equal_value_of_parent);
//         returnArray.is_targeted = 0;
//         returnArray.found.parent_id = 0;
//     }
//     return returnArray;
// }

module.exports = {    
    getOrderList: getOrderList,
    getCustomerOrderList: getCustomerOrderList,
    addNewOrder: addNewOrder,
    fetchPreviousBillingAddresss: fetchPreviousBillingAddresss,
    removeSelectedAddress: removeSelectedAddress,
    getOrderedProductList: getOrderedProductList,
    getOrderedProductListSingleDay: getOrderedProductListSingleDay,
    generatePDFOfOrderedProducts: generatePDFOfOrderedProducts,
    getOrderListOfSingleDay : getOrderListOfSingleDay,
    handlePurchasedRecord: handlePurchasedRecord,
    fetchDeliveryFormData : fetchDeliveryFormData,
    submitDeliveryDetails : submitDeliveryDetails,
    orderVerificationByCustomer: orderVerificationByCustomer,
    handleOrderConfirmation: handleOrderConfirmation,
    getOrderInvoiceLatestVersion: getOrderInvoiceLatestVersion,
};