const Order = require('../models/order.js');
const {isEmpty} = require('../utils/conditionChecker.js');


const getOrderList = async function (req, res, next) {    
    const params = {
        order_status: req.body.order_status,
    }
    try {
        const Model = new Order(params);
        const orderList = await Model.getOrderList();
        const orderedProducts = await Model.getOrderedProduct();
        res.send({ orderList: orderList, orderedProducts: orderedProducts});
    } catch (err) {
        next(err);
    }
}



const getCustomerOrderList = async function (req, res, next) {    
    const params = {
        order_status: req.body.order_status,
        createdBy : req.body.createdBy,
    }
    try {
        const Model = new Order(params);
        const orderList = await Model.getCustomerOrderList();
        const orderedProducts = await Model.getCustomerOrderedProduct();
        res.send({ orderList: orderList, orderedProducts: orderedProducts});
    } catch (err) {
        next(err);
    }
}


const proceedToDelivered = async function (req, res, next) {    
    const params = {
        order_status: req.body.order_status,
        orderId : req.body.orderId,
    }
    try {
        const Model = new Order(params);
        await Model.proceedToDelivered();
        const orderList = await Model.getOrderList();
        const orderedProducts = await Model.getOrderedProduct();
        res.send({ orderList: orderList, orderedProducts: orderedProducts});
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
        createdBy : req.body.createdBy,
        itemsTotal: req.body.itemsTotal,
        cartItems : req.body.cartItems,
    }
    try {
        const Model = new Order(params);
        
        if(!isEmpty(params.shipping_id)){
            const shippingId = await Model.insertShippingDetails();
            Model.shipping_id = shippingId;
        }else{
            await Model.updateShippingDetails();
        }
        
        const orderId = await Model.insertOrderDetails();
        Model.order_id = orderId;
        
        await Model.insertBillingDetails();
        const result = await Model.insertOrderedProduct();

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


module.exports = {    
    getOrderList: getOrderList,
    getCustomerOrderList: getCustomerOrderList,
    proceedToDelivered: proceedToDelivered,
    addNewOrder: addNewOrder,
    fetchPreviousBillingAddresss: fetchPreviousBillingAddresss,
    removeSelectedAddress: removeSelectedAddress,
};