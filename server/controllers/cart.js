const Categories = require('../models/categories.js');
const {ProductCart} = require('../models/cart.js');

// const addProduct = async function (req, res, next) {
    
//     const params = {
//         productId: req.body.productId,
//     }
//     const product = await new Categories({productId: params.productId}).getSingleProduct();

//     const productCart = new ProductCart(req.session.productCart ? req.session.productCart : {});    
//     productCart.addProduct(product[0], params.productId);
//     req.session.productCart = productCart;
//     console.log('req.session.productCart', req.session)
//     res.send({});
// }




module.exports = {    
    // addProduct : addProduct
};