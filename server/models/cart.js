

const ProductCart = function (cart) {
  this.items = cart.items || {};
  this.totalItems = cart.totalItems || 0;
  this.totalPrice = cart.totalPrice || 0;
};

ProductCart.prototype.addProduct = function(item, id){
  const that = this;
    try{
      let cartItem = that.items[id];
      if (!cartItem) {
          cartItem = that.items[id] = {item: item, quantity: 0, price: 0};
      }
      cartItem.quantity++;
      cartItem.price = cartItem.item.price * cartItem.quantity;
      that.totalItems++;
      that.totalPrice += cartItem.item.price;
    }catch(Error){
      console.log(Error)
    }
}



module.exports = {ProductCart: ProductCart};
