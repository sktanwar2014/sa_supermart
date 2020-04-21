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


const getOrderListOfSingleDay = async function (req, res, next) {    
    const params = {
        order_status: req.body.order_status,
        date :  req.body.date,
    }
    try {
        const Model = new Order(params);
        const orderList = await Model.getOrderListOfSingleDay();
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



const fetchDeliveryFormData = async function (req, res, next) {    
    const params = {
       orderId : req.body.orderId, 
       order_date : req.body.order_date,
    }
    try {
        const Model = new Order(params);
        const result = await Model.fetchDeliveryFormData();
        let isAllAvailable =  true;

        if(result !==  undefined && result !== null && result.length > 0){
            result.map(data => {
                if(data.purchased_quantity  === "" || data.cost === "" || data.purchased_quantity  === null || data.cost === null){
                    isAllAvailable = false;
                }
                let available = (data.paid_quantity !== null && data.paid_quantity !== undefined && data.paid_quantity !== "") ? (data.purchased_quantity - data.paid_quantity) : data.purchased_quantity ;
                if( available <= 0){
                    isAllAvailable = false;
                }
            })
        }
        if(isAllAvailable === true){
            res.send({deliveryFormData : result});
        }else{
            res.send({deliveryFormData: []});
        }
    } catch (err) {
        next(err);
    }
}

const handlePurchasedRecord = async function (req, res, next) {    
    const params = {
        product_id : req.body.product_id,
        purchase_date : req.body.purchase_date,
        required_quantity : req.body.required_quantity,
        required_unit_id : req.body.required_unit_id,
        purchased_quantity : req.body.purchased_quantity,
        purchased_unit_id : req.body.purchased_unit_id,
        cost : req.body.cost,
        createdBy : req.body.created_by,
    }
    try {
        const Model = new Order(params);
        const result = await Model.handlePurchasedRecord();

        res.send({result});
    } catch (err) {
        next(err);
    }
}


const getOrderedProductListSingleDay = async function (req, res, next) {    
    const params = {
        date :  req.body.date,
    }
    try {
        const Model = new Order(params);
        const result = await Model.getOrderedProductListSingleDay();
        const calculatedResult = await calculateProductTotalQuantity(result);
        
        let purchaseRecord =  [];

        if(result.length > 0){
            const prodIds = [...new Set(result.map(dist => dist.product_id))];
            Model.product_id = String(prodIds.toString());
            purchaseRecord = await Model.getDailyPurchaseRecords();
        }
    
        // console.log(calculatedResult, purchaseRecord)
            (calculatedResult.length > 0 ? calculatedResult : []).map(data => {
               const found = purchaseRecord.find(ele => {return ele.product_id === data.id})
                if(found !== undefined && found !== null && found !== ""){
                    data.purchased_quantity = found.purchased_quantity;
                    data.purchased_unit_id = found.purchased_unit_id;
                    data.cost = found.cost;
                    data.purchased_status = found.status;
                }else{
                    data.purchased_quantity = '';
                    data.purchased_unit_id = '';
                    data.cost = '';
                    data.purchased_status = '';
                }
            })
        res.send({orderedProductListSingleDay: calculatedResult});
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

        const calculatedResult = await calculateProductTotalQuantity(result);
        
        res.send({orderedProductList: calculatedResult});
    } catch (err) {
        next(err);
    }
}




const submitDeliveryDetails = async function (req, res, next) {  
    const params = {
        formData : req.body.productData,
        orderId : req.body.orderId,
    }
    try {
        const Model = new Order(params);
        const submit = await Model.proceedToDelivered();
        const update = await Model.updatePurchaseRegister();
        const result = await Model.submitDeliveryDetails();
        if(result !== "" && result !== null && result !== undefined){
            res.send(true);
        }else{
            res.send(false);
        }
    } catch (err) {
        next(err);
    }
}




async function calculateProductTotalQuantity(products){

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
    getOrderedProductListSingleDay: getOrderedProductListSingleDay,
    getOrderListOfSingleDay : getOrderListOfSingleDay,
    handlePurchasedRecord: handlePurchasedRecord,
    fetchDeliveryFormData : fetchDeliveryFormData,
    submitDeliveryDetails : submitDeliveryDetails,
};