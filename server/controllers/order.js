const Order = require('../models/order.js');
const {isEmpty} = require('../utils/conditionChecker.js');
const Static = require('../models/static.js')

const getOrderList = async function (req, res, next) {    
    const params = {
        order_status: req.body.order_status,
        from_date :  req.body.from_date,
        to_date :  req.body.to_date,
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
        // itemsTotal: req.body.itemsTotal,
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
        
        // await Model.insertBillingDetails();
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




const getOrderedProductList = async function (req, res, next) {    
    const params = {
        from_date :  req.body.from_date,
        to_date :  req.body.to_date,
    }
    try {
        const Model = new Order(params);
        const result = await Model.getOrderedProductList();

        const productUnitList = await new Static({}).getProductUnitList();

        const calculatedResult = await calculateProductTotalQuantity(result, productUnitList);
        
        // console.log(calculatedResult);
        res.send({orderedProductList: calculatedResult});
    } catch (err) {
        next(err);
    }
}

async function calculateProductTotalQuantity(products, unitList){

    const prodIds = [...new Set(products.map(dist => dist.product_id))];
    let returnValues  = [];

    prodIds.map(prodId => {
        let units = [];
        let product =[];
        let weight =  0;
        Object.values(products).map((prod) => {
            if(prodId === prod.product_id){
                product = prod;
                
                let unit_id = 0;
                let weight = 0;
                if(prod.is_packet == 1){
                    unit_id = prod.packet_unit_id;     weight = prod.packet_weight * prod.quantity;
                }else{
                    unit_id = prod.unit_id;            weight = prod.quantity;
                }

                if(units.length == 0){
                    units.push({id: unit_id, weight: weight})
                }else{
                    const found = units.find((ele) => {return ele.id == unit_id});
                    if(found){
                        let temp = [...units];
                        temp.map((data, index) => {
                            if(data.id == unit_id){
                                units[index].weight =  units[index].weight + weight;
                            }
                        })
                    }else{
                        units.push({id: unit_id, weight: weight})
                    }
                }
            }
        })

        units.map(w  => {
            if(product.main_unit_id === 1 || product.main_unit_id === 3){
                if(w.id === 2 || w.id === 4){
                    weight = weight + (w.weight /1000);
                }else if(w.id === 1 || w.id === 3){
                    weight = weight + w.weight;
                }
            }else if(product.main_unit_id === 2 || product.main_unit_id === 4){
                if(w.id === 2 || w.id === 4){
                    weight = weight  + w.weight;
                }else if(w.id === 1 || w.id  === 3){
                    weight = weight + w.weight * 1000;
                }
            }else if(product.main_unit_id === 5){
                if(w.id === 5){
                    weight = weight  + w.weight;
                }
            }
        })


        returnValues.push({
            id : product.product_id,
            product_name : product.product_name,
            weight : weight,
            main_unit_id: product.main_unit_id,
            unit_name: product.unit_name,
        });

        // console.log('units',units);

        // let weight = 0;
        // units.map(data => {
        //     if(data.id === product.main_unit_id){
        //         weight =  weight + data.weight;
        //     }else{
        //         let a= true;
        //         let unit_id = data.id;
        //         let inChild = false;
        //         while(a){                    
        //             const result = await check(data, unitList, unit_id, product.main_unit_id, inChild);
        //             if(result.is_targeted === 1){
        //                 weight = weight + result.weight;
        //                 a = false;
        //             }else{

        //             }
        //         }
               
        //     }
        // })
        // console.log('weight',weight);
    })  
    return returnValues;
}


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
    proceedToDelivered: proceedToDelivered,
    addNewOrder: addNewOrder,
    fetchPreviousBillingAddresss: fetchPreviousBillingAddresss,
    removeSelectedAddress: removeSelectedAddress,
    getOrderedProductList: getOrderedProductList,
};