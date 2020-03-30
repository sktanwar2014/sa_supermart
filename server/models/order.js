const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const Order = function (params) {  
  this.order_status = params.order_status;
  this.orderId = params.orderId;
  this.firstName = params.firstName;
  this.lastName = params.lastName;
  this.state = params.state;
  this.streetAddress = params.streetAddress;
  this.flatAdd = params.flatAdd;
  this.city = params.city;
  this.postCode = params.postCode;
  this.phone = params.phone;
  this.email = params.email;
  this.createdBy = params.createdBy;
  this.itemsTotal= params.itemsTotal;
  this.cartItems = params.cartItems;
};


Order.prototype.proceedToDelivered = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`UPDATE ordered_product as op INNER JOIN orders as o ON o.id = op.order_id SET op.status = '2', o.status = '2' WHERE o.id = ${that.orderId}`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Order.prototype.addNewOrder = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      const shippingDetails = [
        that.createdBy, that.firstName + ' ' + that.lastName, that.phone, that.email, that.postCode, that.flatAdd, that.streetAddress, that.city, that.state, 1 , 1, that.createdBy
      ]
      connection.query('INSERT INTO `shipping_details`(`user_id`, `full_name`, `mobile`, `email`, `pincode`, `flat_add`, `street_add`, `city`, `state`, `status`, `is_active`, `created_by`) VALUES (?)', [shippingDetails], function (error, shippingResult, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
          
        const orderDetails=[Math.ceil(Math.random() *1000000000), that.createdBy, shippingResult.insertId, new Date(), 1, 1, that.createdBy]
        connection.query('INSERT INTO `orders`(`order_id`, `user_id`, `shipping_id`, `order_date`, `status`, `is_active`, `created_by`) VALUES (?)', [orderDetails], function (error, orderResult, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
        
          const billingDetails=[ orderResult.insertId, that.createdBy, that.itemsTotal, 0, 0, 0, 0, that.itemsTotal, 1, 1, that.createdBy]
          connection.query('INSERT INTO `order_billing`( `order_id`, `user_id`, `items_total`, `packing`, `delivery`, `tax`, `promotion`, `total`, `status`, `is_active`, `created_by`) VALUES (?)', [billingDetails], function (error, rows, fields) {
              if (error) {  console.log("Error...", error); reject(error);  }
              
              // let orderedProductDetails = [];
              that.cartItems.map((data, index) => {
                let product = [that.createdBy, orderResult.insertId, Math.ceil(Math.random() *1000000000), data.id, data.quantity, data.unit_id, data.total, 1, 1, that.createdBy]
                connection.query('INSERT INTO `ordered_product`( `user_id`, `order_id`, `tracking_id`, `product_id`, `quantity`, `unit_id`, `total`, `status`, `is_active`, `created_by`) VALUES (?)', [product], function (error, rows, fields) {
                  if (error) {  console.log("Error...", error); reject(error);}
                    resolve(rows);
                });
              })
              // console.log(orderedProductDetails)
              
            });            
          });
        });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Order.prototype.getOrderedProduct = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT op.id, op.user_id,op.order_id, p.product_name, p.price, srv.value as unit_name, srv2.value as ordered_unit_name, op.tracking_id, op.product_id, op.quantity, op.unit_id, op.total, op.status FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id INNER JOIN static_records_value as srv ON srv.id = p.unit_id INNER JOIN static_records_value as srv2 ON srv2.id = op.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status = ${that.order_status})`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Order.prototype.getOrderList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT op.id, op.user_id,op.order_id, p.product_name, p.price, srv.value as unit_name, srv2.value as ordered_unit_name, op.tracking_id, op.product_id, op.quantity, op.unit_id, op.total, op.status FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id INNER JOIN static_records_value as srv ON srv.id = p.unit_id INNER JOIN static_records_value as srv2 ON srv2.id = op.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status = ${that.order_status})`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


module.exports = Order;
