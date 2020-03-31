const Order = require('../models/order.js');

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
        const result = await Model.addNewOrder();
        console.log(result)
        if(result !== null && result !== undefined && result !== ""){
            res.send(true);
        }else{
            res.send(false);
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {    
    getOrderList: getOrderList,
    getCustomerOrderList: getCustomerOrderList,
    proceedToDelivered: proceedToDelivered,
    addNewOrder: addNewOrder,
};