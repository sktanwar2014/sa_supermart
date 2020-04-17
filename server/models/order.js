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
  this.userId = params.userId;
  this.shipping_id = params.shipping_id;
  this.order_id = params.order_id;
  this.id = params.id;
  this.to_date = params.to_date;
  this.from_date = params.from_date;
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




















Order.prototype.updateShippingDetails = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      
      const shippingDetails = [
       that.firstName + ' ' + that.lastName, that.phone, that.email, that.postCode, that.flatAdd, that.streetAddress, that.city, that.state, 1 , 1, that.createdBy, that.shipping_id
      ]
      connection.query('UPDATE `shipping_details` SET `full_name` = ?, `mobile` = ?, `email` = ?, `pincode` = ?, `flat_add` = ?, `street_add` = ?, `city` = ?, `state` = ?, `status` = ?, `is_active` = ?, `updated_by` = ? WHERE `id`  =  ?', shippingDetails, function (error, shippingResult, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(shippingResult)
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 





Order.prototype.insertShippingDetails = function () {
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
        resolve(shippingResult.insertId)
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Order.prototype.insertOrderDetails = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
        connection.changeUser({database : dbName});
        const orderDetails=[Math.ceil(Math.random() *1000000000), that.createdBy, that.shipping_id, new Date(), 1, 1, that.createdBy]
        connection.query('INSERT INTO `orders`(`order_id`, `user_id`, `shipping_id`, `order_date`, `status`, `is_active`, `created_by`) VALUES (?)', [orderDetails], function (error, orderResult, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve(orderResult.insertId)
        });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



// Order.prototype.insertBillingDetails = function () {
//   const that = this;
//   return new Promise(function (resolve, reject) {
//     connection.getConnection(function (error, connection) {
//       if (error) {
//         throw error;
//       }
//       connection.changeUser({database : dbName});
//           const billingDetails=[ that.order_id, that.createdBy, that.itemsTotal, 0, 0, 0, 0, that.itemsTotal, 1, 1, that.createdBy]
//           connection.query('INSERT INTO `order_billing`( `order_id`, `user_id`, `items_total`, `packing`, `delivery`, `tax`, `promotion`, `total`, `status`, `is_active`, `created_by`) VALUES (?)', [billingDetails], function (error, rows, fields) {
//               if (error) {  console.log("Error...", error); reject(error);  }
//               resolve(rows.insertId);
//         });
//         connection.release();
//         console.log('Process Complete %d', connection.threadId);
//     });
//   });
// } 


Order.prototype.insertOrderedProduct = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});

      that.cartItems.map((data, index) => {
        let product = [that.createdBy, that.order_id, Math.ceil(Math.random() *1000000000), data.id, data.quantity, data.unit_id, 1, 1, that.createdBy]
        connection.query('INSERT INTO `ordered_product`( `user_id`, `order_id`, `tracking_id`, `product_id`, `quantity`, `unit_id`, `status`, `is_active`, `created_by`) VALUES (?)', [product], function (error, rows, fields) {
          if (error) {  console.log("Error...", error); reject(error);}
            resolve(rows);
        });
      })
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
      connection.query(`SELECT op.id, op.user_id, op.order_id, p.product_name, unit.unit_name as ordered_unit_name, op.tracking_id, op.product_id, op.quantity, op.unit_id,  op.status FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = op.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status = ${that.order_status})`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 





Order.prototype.getCustomerOrderedProduct = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT op.id, op.user_id, op.order_id, p.product_name, unit.unit_name as ordered_unit_name, op.tracking_id, op.product_id, op.quantity, op.unit_id,  op.status FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = op.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status = ${that.order_status} AND user_id = ${that.createdBy})`, function (error, rows, fields) {
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
      // connection.query(`SELECT o.id, o.order_id, o.user_id, o.order_date, sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, ob.items_total, ob.packing, ob.delivery, ob.tax, ob.promotion, ob.total FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN order_billing as ob ON o.id = ob.order_id WHERE o.is_active = 1 AND o.status = ${that.order_status}`, function (error, rows, fields) {
      connection.query(`SELECT o.id, o.order_id, o.user_id, o.order_date, sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id WHERE o.is_active = 1 AND o.status = ${that.order_status} AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}')`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 





Order.prototype.getCustomerOrderList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      // connection.query(`SELECT o.id, o.order_id, o.user_id, o.order_date, sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, ob.items_total, ob.packing, ob.delivery, ob.tax, ob.promotion, ob.total FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN order_billing as ob ON o.id = ob.order_id WHERE o.is_active = 1 AND o.status = ${that.order_status} AND o.user_id = ${that.createdBy}`, function (error, rows, fields) {
        connection.query(`SELECT o.id, o.order_id, o.user_id, o.order_date, sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id WHERE o.is_active = 1 AND o.status = ${that.order_status} AND o.user_id = ${that.createdBy}`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 







Order.prototype.fetchPreviousBillingAddresss = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query('SELECT `id`, `user_id`, `full_name`, `mobile`, `email`, `pincode`, `flat_add`, `street_add`, `city`, `state`,  `status`, `is_active` FROM `shipping_details` WHERE user_id = "'+that.userId+'" AND is_active = 1', function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Order.prototype.removeSelectedAddress = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query('UPDATE `shipping_details` SET is_active = 0 WHERE id = "'+that.id+'"', function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 






Order.prototype.getOrderedProductList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = `SELECT op.id, op.user_id, op.order_id, op.tracking_id, op.product_id, op.quantity, op.unit_id, op.status, op.is_active, p.product_name, p.main_unit_id, unit.unit_name, unit.id as unit_table_id, unit.equal_value_of_parent, pm.unit_value, pm.price, pm.is_packet, pm.packet_weight, pm.packet_unit_id from ordered_product as op INNER JOIN products AS p ON p.id = op.product_id INNER JOIN unit_records as unit ON unit.id = p.main_unit_id INNER JOIN products_measurement as pm ON pm.product_id = op.product_id AND pm.unit_id = op.unit_id WHERE op.order_id IN(SELECT id FROM orders WHERE is_active = 1 AND status = 1 AND (DATE_FORMAT(order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}'))`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}



module.exports = Order;
