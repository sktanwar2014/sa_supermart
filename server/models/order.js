const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const Order = function (params) {  
  this.order_status = params.order_status;
  this.orderId = params.orderId;
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



Order.prototype.getOrderList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT o.id, o.order_id, o.user_id, o.order_date, sd.full_name, sd.mobile, sd.pincode,sd.flat_add, sd.street_add, sd.state, sd.city, ob.items_total, ob.packing, ob.delivery, ob.tax, ob.promotion, ob.total FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN order_billing as ob ON o.id = ob.order_id WHERE o.is_active = 1 AND o.status = ${that.order_status}`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
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



module.exports = Order;
