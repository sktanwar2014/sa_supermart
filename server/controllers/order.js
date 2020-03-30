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


module.exports = {    
    getOrderList: getOrderList,
    proceedToDelivered: proceedToDelivered,
};