const Static = require('../models/static.js');

const getProductUnitList = async function (req, res, next) {    
    try {
        const StaticModel = new Static({});
        const productUnitList = await StaticModel.getProductUnitList();
        
        res.send({ productUnitList: productUnitList});
    } catch (err) {
        next(err);
    }
}



const getMeasuredUnitofProduct = async function (req, res, next) {
    try {
        const StaticModel = new Static({productId: req.body.productId});
        const productUnitList = await StaticModel.getMeasuredUnitofProduct();
        
        res.send({ productUnitList: productUnitList});
    } catch (err) {
        next(err);
    }
}



const getOrderStatusList = async function (req, res, next) {
    try {
        const StaticModel = new Static({});
        const orderStatusList = await StaticModel.getOrderStatusList();
        
        res.send({ orderStatusList: orderStatusList});
    } catch (err) {
        next(err);
    }
}

const getMainUnitRelateRecords = async function (req, res, next) { 
    let params = {
        id : Number(req.body.id),
        is_bundle : Number(req.body.is_bundle),
    }   
    try {
        const StaticModel = new Static(params);
        const productUnitList = await StaticModel.getMainUnitRelateRecords();
        res.send({ productUnitList: productUnitList});
    } catch (err) {
        next(err);
    }
}




module.exports = {    
    getProductUnitList : getProductUnitList,    
    getMainUnitRelateRecords : getMainUnitRelateRecords,
    getOrderStatusList: getOrderStatusList,
    getMeasuredUnitofProduct : getMeasuredUnitofProduct,
};