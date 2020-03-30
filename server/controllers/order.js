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
        await Model.addNewOrder();
        
        // const orderList = await Model.getOrderList();
        // const orderedProducts = await Model.getOrderedProduct();
        res.send(true);
    } catch (err) {
        next(err);
    }
}

module.exports = {    
    getOrderList: getOrderList,
    proceedToDelivered: proceedToDelivered,
    addNewOrder: addNewOrder,
};