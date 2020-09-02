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
  this.date = params.date;
  this.product_id = params.product_id;
  this.purchase_date = params.purchase_date;
  this.required_quantity = params.required_quantity;
  this.required_unit_id = params.required_unit_id;
  this.purchased_quantity = params.purchased_quantity;
  this.purchased_unit_id = params.purchased_unit_id;
  this.cost = params.cost;
  this.order_date = params.order_date;
  this.formData = params.formData;
  // this.is_date_range = params.is_date_range;
  this.user_ids = params.user_ids;
  this.ordered_id = params.ordered_id;
  this.delivered_id = params.delivered_id;
};



Order.prototype.getCompanyDetails = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});

      connection.query(`SELECT first_name, email, mobile, address, city, state, postcode FROM profile WHERE user_id = 1 AND is_active = 1`, function (error, companyDetail, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
          resolve(companyDetail);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 

Order.prototype.getLastestOrderInvoiceDetails = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      
      connection.query(`SELECT first_name, email, mobile, state, address, city, postcode FROM profile WHERE user_id = 1 AND is_active = 1`, function (error, companyDetail, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        connection.query(`SELECT o.order_id, o.order_date, sd.full_name,  sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.city, sd.state, dp.delivery_date FROM orders AS o INNER JOIN shipping_details AS sd ON sd.id = o.shipping_id LEFT JOIN ordered_product as op ON o.id = op.order_id LEFT JOIN delivered_product as dp ON dp.ordered_id = op.id  WHERE o.id = ${that.orderId} GROUP BY op.order_id`, function (error, shippingDetail, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
            // connection.query(`SELECT op.id, (CASE op.status WHEN 6 THEN dp.paid_quantity WHEN 5 THEN vp.quantity END) as quantity, (CASE op.status WHEN 6 THEN dp.unit_id WHEN 5 THEN vp.unit_id END) as unit_id, (CASE op.status WHEN 6 THEN ur.unit_name WHEN 5 THEN ur2.unit_name END) as unit_name, p.product_name FROM ordered_product as op INNER JOIN  products as p ON op.product_id = p.id LEFT JOIN delivered_product as dp ON op.id = dp.ordered_id LEFT JOIN verified_product as vp ON op.id = vp.ordered_id LEFT JOIN unit_records as ur ON ur.id = dp.unit_id LEFT JOIN unit_records as ur2 ON ur2.id = vp.unit_id WHERE op.order_id = ${that.orderId} AND op.status IN(5,6)`, function (error, productDetails, fields) {              
            // connection.query(`SELECT op.id, o.id as order_id, o.order_date, pr.purchase_date, pr.purchased_quantity, pr.purchased_unit_id, pr.cost, (CASE op.status WHEN 6 THEN dp.paid_quantity WHEN 5 THEN vp.quantity END) as quantity, (CASE op.status WHEN 6 THEN dp.unit_id WHEN 5 THEN vp.unit_id END) as unit_id, (CASE op.status WHEN 6 THEN ur.unit_name WHEN 5 THEN ur2.unit_name END) as unit_name, p.product_name FROM ordered_product as op INNER JOIN  products as p ON op.product_id = p.id LEFT JOIN delivered_product as dp ON op.id = dp.ordered_id LEFT JOIN verified_product as vp ON op.id = vp.ordered_id LEFT JOIN unit_records as ur ON ur.id = dp.unit_id LEFT JOIN unit_records as ur2 ON ur2.id = vp.unit_id INNER JOIN orders as o ON o.id = op.order_id LEFT  JOIN purchase_register as pr ON (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d')) = (DATE_FORMAT(o.order_date, '%Y-%m-%d')) AND pr.product_id = op.product_id AND pr.is_active = 1 WHERE op.order_id = ${that.orderId} AND op.status IN(5,6)`, function (error, productDetails, fields) {
              // connection.query(`SELECT (CASE op.status WHEN 6 THEN dp.paid_quantity WHEN 5 THEN vp.quantity END) as quantity, (CASE op.status WHEN 6 THEN ur.unit_name WHEN 5 THEN ur2.unit_name END) as unit_name, (CASE op.status WHEN 6 THEN dp.price WHEN 5 THEN ((pr.cost / pr.purchased_quantity) * vp.quantity) END) as price, p.product_name FROM ordered_product as op INNER JOIN  products as p ON op.product_id = p.id LEFT JOIN delivered_product as dp ON op.id = dp.ordered_id LEFT JOIN verified_product as vp ON op.id = vp.ordered_id LEFT JOIN unit_records as ur ON ur.id = dp.unit_id LEFT JOIN unit_records as ur2 ON ur2.id = vp.unit_id INNER JOIN orders as o ON o.id = op.order_id LEFT  JOIN purchase_register as pr ON (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d')) = (DATE_FORMAT(o.order_date, '%Y-%m-%d')) AND pr.product_id = op.product_id AND pr.is_active = 1 WHERE op.order_id = ${that.orderId} AND op.status IN(5,6)`, function (error, productDetails, fields) {
                connection.query(`SELECT (CASE dp.status WHEN 6 THEN dp.paid_quantity WHEN 5 THEN vp.quantity END) as quantity, (CASE dp.status WHEN 6 THEN ur.unit_name WHEN 5 THEN ur2.unit_name END) as unit_name, (CASE dp.status WHEN 6 THEN dp.price WHEN 5 THEN (pr.cost_of_each * vp.quantity) END) as price, p.product_name FROM delivered_product as dp INNER JOIN  products as p ON dp.product_id = p.id LEFT JOIN verified_product as vp ON dp.id = vp.delivered_id LEFT JOIN unit_records as ur ON ur.id = dp.unit_id LEFT JOIN unit_records as ur2 ON ur2.id = vp.unit_id INNER JOIN orders as o ON o.id = dp.order_id LEFT  JOIN purchase_register as pr ON (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d')) = (DATE_FORMAT(o.order_date, '%Y-%m-%d')) AND pr.product_id = dp.product_id AND pr.purchased_unit_id = dp.unit_id AND pr.is_active = 1 WHERE dp.order_id = ${that.orderId} AND dp.status IN(5,6)`, function (error, productDetails, fields) {
                // connection.query(`SELECT (CASE dp.status WHEN 6 THEN dp.paid_quantity WHEN 5 THEN vp.quantity END) as quantity, (CASE dp.status WHEN 6 THEN ur.unit_name WHEN 5 THEN ur2.unit_name END) as unit_name, (CASE dp.status WHEN 6 THEN (dp.price / dp.paid_quantity) WHEN 5 THEN pr.cost_of_each END) as unit_price, (CASE dp.status WHEN 6 THEN dp.price WHEN 5 THEN (pr.cost_of_each * vp.quantity) END) as total_amt,  (CASE dp.status WHEN 6 THEN dp.unit_id WHEN 5 THEN vp.unit_id END) as unit_id, p.product_name, p.id AS product_id FROM delivered_product as dp INNER JOIN  products as p ON dp.product_id = p.id LEFT JOIN verified_product as vp ON dp.id = vp.delivered_id LEFT JOIN unit_records as ur ON ur.id = dp.unit_id LEFT JOIN unit_records as ur2 ON ur2.id = vp.unit_id INNER JOIN orders as o ON o.id = dp.order_id LEFT  JOIN purchase_register as pr ON (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d')) = (DATE_FORMAT(o.order_date, '%Y-%m-%d')) AND pr.product_id = dp.product_id AND pr.purchased_unit_id = dp.unit_id AND pr.is_active = 1 WHERE dp.order_id = ${that.orderId} AND dp.status IN(5,6)`, function (error, productDetails, fields) {
                // console.log(`SELECT (CASE dp.status WHEN 6 THEN dp.paid_quantity WHEN 5 THEN vp.quantity END) as quantity, (CASE dp.status WHEN 6 THEN ur.unit_name WHEN 5 THEN ur2.unit_name END) as unit_name, (CASE dp.status WHEN 6 THEN dp.price WHEN 5 THEN (pr.cost_of_each * vp.quantity) END) as price, p.product_name FROM delivered_product as dp INNER JOIN  products as p ON dp.product_id = p.id LEFT JOIN verified_product as vp ON dp.id = vp.delivered_id LEFT JOIN unit_records as ur ON ur.id = dp.unit_id LEFT JOIN unit_records as ur2 ON ur2.id = vp.unit_id INNER JOIN orders as o ON o.id = dp.order_id LEFT  JOIN purchase_register as pr ON (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d')) = (DATE_FORMAT(o.order_date, '%Y-%m-%d')) AND pr.product_id = dp.product_id AND pr.purchased_unit_id = dp.unit_id AND pr.is_active = 1 WHERE dp.order_id = ${that.orderId} AND dp.status IN(5,6)`)
              if (error) {  console.log("Error...", error); reject(error);  }
                resolve({companyDetail: companyDetail, shippingDetail: shippingDetail, productDetails: productDetails});
            });
        });
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}



Order.prototype.getItemListForFirstInvoicing = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({database : dbName});
      let Query = 'SELECT dp.id, (CASE dp.status WHEN 6 THEN dp.paid_quantity WHEN 5 THEN vp.quantity END) as quantity, (CASE dp.status WHEN 6 THEN ur.unit_name WHEN 5 THEN ur2.unit_name END) as unit_name, (CASE dp.status WHEN 6 THEN (dp.price / dp.paid_quantity) WHEN 5 THEN pr.cost_of_each END) as unit_price, (CASE dp.status WHEN 6 THEN dp.price WHEN 5 THEN (pr.cost_of_each * vp.quantity) END) as total_amt, (CASE dp.status WHEN 6 THEN dp.unit_id WHEN 5 THEN vp.unit_id END) AS unit_id, p.product_name AS item_name, p.id AS item_id FROM delivered_product as dp INNER JOIN  products as p ON dp.product_id = p.id LEFT JOIN verified_product as vp ON dp.id = vp.delivered_id LEFT JOIN unit_records as ur ON ur.id = dp.unit_id LEFT JOIN unit_records as ur2 ON ur2.id = vp.unit_id INNER JOIN orders as o ON o.id = dp.order_id LEFT  JOIN purchase_register as pr ON (DATE_FORMAT(pr.purchase_date, "%Y-%m-%d")) = (DATE_FORMAT(o.order_date, "%Y-%m-%d")) AND pr.product_id = dp.product_id AND pr.purchased_unit_id = dp.unit_id AND pr.is_active = 1 WHERE dp.order_id = "'+ that.orderId + '" AND dp.status IN(5,6);';
      // console.log(Query);
      connection.query(Query, function (error, result, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }          
          resolve(result);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}

Order.prototype.proceedToDelivered = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`UPDATE ordered_product SET status = '3' WHERE order_id = '${that.orderId}';`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
          
          connection.query('UPDATE ordered_product SET status = 2 WHERE id IN('+ that.ordered_id +');', function (error, rows, fields) {
            if (error) {  console.log("Error...", error); reject(error);  }
            resolve(rows);
          });
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Order.prototype.handleOrderConfirmation = function (data) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({database : dbName});
      connection.query('UPDATE delivered_product SET status = "'+ data.status +'" WHERE id IN('+ data.delivered_id +');', function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });

      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Order.prototype.updatePurchaseRegister = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});      
      connection.query('UPDATE purchase_register SET status = 3 WHERE product_id IN('+that.product_id+') AND (DATE_FORMAT(purchase_date, \'%Y-%m-%d\') IN("'+that.order_date+'")) AND is_active = 1;', function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });

        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}



Order.prototype.submitDeliveryDetails = function (deliveredData) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});

      // let VALUES = [data.order_id, data.ordered_id, data.product_id, data.tracking_id, data.order_date, data.delivery_date,  data.paid_quantity, data.unit_id, data.price, 2, 1, that.createdBy];
      connection.query('INSERT INTO delivered_product(order_id, ordered_id, product_id, tracking_id, order_date, delivery_date, paid_quantity, unit_id, price, status, is_active, created_by) VALUES ?;', [deliveredData], function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }          
          resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}


Order.prototype.fetchDeliveryFormData = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      // let Query = `SELECT SUM(dp.paid_quantity) AS paid_quantity,  op.id, op.tracking_id, p.product_name, unit.unit_name as ordered_unit_name, op.product_id, op.quantity, op.unit_id,  op.status, pr.purchased_quantity, pr.purchased_unit_id, pr.cost, unit2.unit_name as purchased_unit_name FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = op.unit_id LEFT JOIN purchase_register as pr ON pr.product_id  = op.product_id AND pr.is_active =  1 AND (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d') = '${that.order_date}')  LEFT JOIN unit_records as unit2 ON pr.purchased_unit_id = unit2.id LEFT JOIN delivered_product as dp ON op.product_id = dp.product_id  AND (DATE_FORMAT(dp.order_date, '%Y-%m-%d') = '${that.order_date}') WHERE op.order_id = ${that.orderId} GROUP BY op.product_id`
      // let Query2 = `SELECT pr.product_id, pr.purchased_quantity, pr.purchased_unit_id, pr.cost, pr.cost_of_each, pr.is_extra, pr.status,
      //               p.product_name, ur.unit_name as purchased_unit_name, SUM(dp.paid_quantity) AS paid_quantity FROM purchase_register as pr INNER JOIN products as p ON p.id = pr.product_id LEFT JOIN unit_records as ur ON pr.purchased_unit_id = ur.id LEFT JOIN delivered_product as dp ON pr.product_id = dp.product_id AND (DATE_FORMAT(dp.order_date, '%Y-%m-%d') = '${that.order_date}') WHERE pr.is_active =  1 AND (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d') = '${that.order_date}') AND pr.is_extra = 1 GROUP BY pr.product_id`;

      // let Query = `SELECT GROUP_CONCAT(dp.paid_quantity) AS paid_quantity, op.id, op.tracking_id, p.product_name, unit.unit_name as ordered_unit_name, op.product_id, op.quantity, op.unit_id,  op.status, GROUP_CONCAT(pr.purchased_quantity) as purchased_quantity, GROUP_CONCAT(pr.purchased_unit_id) as purchased_unit_id, GROUP_CONCAT(pr.cost) as cost, GROUP_CONCAT(unit2.unit_name) as purchased_unit_name FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = op.unit_id LEFT JOIN purchase_register as pr ON pr.product_id  = op.product_id AND pr.is_active =  1 AND (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d') = '${that.order_date}')  LEFT JOIN unit_records as unit2 ON pr.purchased_unit_id = unit2.id LEFT JOIN delivered_product as dp ON op.product_id = dp.product_id AND dp.unit_id = op.unit_id AND (DATE_FORMAT(dp.order_date, '%Y-%m-%d') = '${that.order_date}') WHERE op.order_id = ${that.orderId} GROUP BY op.product_id;`;
      // let Query2 = `SELECT pr.product_id, GROUP_CONCAT(pr.purchased_quantity) as purchased_quantity, GROUP_CONCAT(pr.purchased_unit_id) as purchased_unit_id, GROUP_CONCAT(pr.cost) as cost, GROUP_CONCAT(pr.cost_of_each) as cost_of_each, pr.is_extra, pr.status, p.product_name, GROUP_CONCAT(ur.unit_name) as purchased_unit_name, SUM(dp.paid_quantity) AS paid_quantity FROM purchase_register as pr INNER JOIN products as p ON p.id = pr.product_id LEFT JOIN unit_records as ur ON pr.purchased_unit_id = ur.id LEFT JOIN delivered_product as dp ON pr.product_id = dp.product_id AND (DATE_FORMAT(dp.order_date, '%Y-%m-%d') = '${that.order_date}') WHERE pr.is_active =  1 AND (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d') = '${that.order_date}') AND pr.is_extra = 1 GROUP BY pr.product_id;`;

      let Query = `SELECT GROUP_CONCAT(CASE WHEN (paid.paid_quantity IS NULL OR paid.paid_quantity = 0) THEN 0 ELSE paid.paid_quantity END) AS paid_quantity, 
                  GROUP_CONCAT(CASE WHEN (paid.paid_quantity IS NULL OR paid.paid_quantity = 0) THEN pr.purchased_quantity ELSE pr.purchased_quantity - paid.paid_quantity END) AS available,
                  op.id, op.tracking_id, p.product_name, unit.unit_name as ordered_unit_name, op.product_id, op.quantity, op.unit_id,  op.status, 
                  GROUP_CONCAT(pr.purchased_quantity) as purchased_quantity, 
                  GROUP_CONCAT(pr.purchased_unit_id) as purchased_unit_id, 
                  GROUP_CONCAT(pr.cost) as cost, 
                  GROUP_CONCAT(unit2.unit_name) as purchased_unit_name 
                  FROM ordered_product as op 
                  INNER JOIN products as p ON p.id = op.product_id  
                  INNER JOIN unit_records as unit ON unit.id = op.unit_id 
                  LEFT JOIN purchase_register as pr ON pr.product_id  = op.product_id AND pr.is_active =  1 AND (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d') = '${that.order_date}')  
                  LEFT JOIN unit_records as unit2 ON pr.purchased_unit_id = unit2.id 
                  LEFT JOIN (SELECT dp.product_id, dp.unit_id, SUM(dp.paid_quantity) as paid_quantity FROM delivered_product as dp INNER JOIN ordered_product as op ON op.product_id = dp.product_id AND dp.order_date LIKE '${that.order_date}%' WHERE op.order_id = ${that.orderId} GROUP BY dp.product_id, dp.unit_id) as paid ON paid.product_id = pr.product_id AND paid.unit_id = pr.purchased_unit_id 
                  WHERE op.order_id = ${that.orderId} 
                  GROUP BY op.product_id;`;
      
      let Query2 = `SELECT pr.product_id, GROUP_CONCAT(pr.purchased_quantity) as purchased_quantity, GROUP_CONCAT(pr.purchased_unit_id) as purchased_unit_id, GROUP_CONCAT(pr.cost) as cost, GROUP_CONCAT(pr.cost_of_each) as cost_of_each, 
                    pr.is_extra, pr.status, p.product_name, GROUP_CONCAT(ur.unit_name) as purchased_unit_name,  
                    GROUP_CONCAT(CASE WHEN (paid.paid_quantity IS NULL OR paid.paid_quantity = 0) THEN 0 ELSE paid.paid_quantity END) AS paid_quantity,
                    GROUP_CONCAT(CASE WHEN (paid.paid_quantity IS NULL OR paid.paid_quantity = 0) THEN pr.purchased_quantity ELSE pr.purchased_quantity - paid.paid_quantity END) AS available
                    FROM purchase_register as pr 
                    INNER JOIN products as p ON p.id = pr.product_id
                    LEFT JOIN unit_records as ur ON pr.purchased_unit_id = ur.id 
                    LEFT JOIN (SELECT dp.product_id, dp.unit_id, SUM(dp.paid_quantity) as paid_quantity FROM delivered_product as dp INNER JOIN purchase_register as pr ON dp.product_id = pr.product_id AND pr.purchase_date = dp.order_date WHERE pr.purchase_date LIKE '${that.order_date}%' GROUP BY dp.product_id, dp.unit_id) AS paid ON paid.product_id = pr.product_id AND paid.unit_id = pr.purchased_unit_id
                    WHERE pr.is_active =  1 AND (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d') = '${that.order_date}') AND (pr.is_extra = 1 OR pr.purchased_quantity > pr.required_quantity)
                    GROUP BY pr.product_id`;

      // console.log(Query)
      // console.log(Query2)
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        connection.query(Query2, function (error, result, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve({deliveryFormData: rows, extraPurchased: result});
        });
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Order.prototype.handlePurchasedRecord = function (data) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({database : dbName});
        
      connection.query(`SELECT * FROM purchase_register WHERE product_id = ${data.product_id} AND purchased_unit_id = '${data.purchased_unit_id}' AND purchase_date = '${data.purchase_date}' AND is_active = 1;`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error); }
        
        let insertValues = [data.product_id, data.purchase_date, data.required_quantity, data.required_unit_id, data.purchased_quantity, data.purchased_unit_id, data.cost, data.cost_of_each, data.is_extra, 1, 1, data.createdBy];
        const prod = rows[0];
        if(rows.length > 0){
          if(prod.purchased_quantity != data.purchased_quantity || prod.cost != data.cost || prod.cost_of_each != data.cost_of_each || prod.required_quantity != data.required_quantity){
            connection.query(`UPDATE purchase_register SET is_active = 0, status = 2, updated_by = ${data.createdBy},  updated_at = now() WHERE id = ${prod.id}`, function (error, updateResult, fields) {
              if (error) {  console.log("Error...", error); reject(error);  }
              connection.query(`INSERT INTO purchase_register(product_id, purchase_date, required_quantity, required_unit_id, purchased_quantity, purchased_unit_id, cost, cost_of_each, is_extra, status, is_active, created_by) VALUES (?)`, [insertValues], function (error, rows, fields) {
                if (error) {  console.log("Error...", error); reject(error);  }
                resolve(rows.insertId)
              });
            });
          }else{
            resolve()
          }
        }else{
          connection.query(`INSERT INTO purchase_register(product_id, purchase_date, required_quantity, required_unit_id, purchased_quantity, purchased_unit_id, cost, cost_of_each, is_extra, status, is_active, created_by) VALUES (?)`, [insertValues], function (error, rows, fields) {
            if (error) {  console.log("Error...", error); reject(error);  }
            resolve(rows.insertId)
          });
        }
      });
      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Order.prototype.updateProductPrice = function (data) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      connection.changeUser({database : dbName});
       
      connection.query(`SELECT * FROM products_measurement WHERE product_id = ${data.product_id} AND unit_id = ${data.purchased_unit_id} AND is_active = 1 ;`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error); }          
          const prod = rows[0];
          if(rows.length > 0){
            if(prod.price_per_unit !== data.cost_of_each){
              connection.query(`UPDATE products_measurement SET is_active = 0, updated_at = now() WHERE id = ${prod.id}`, function (error, updateResult, fields) {
                if (error) {  console.log("Error...", error); reject(error);  }
                
                let insertValues = [prod.product_id, prod.unit_value, prod.unit_id, (prod.unit_value * data.cost_of_each), data.cost_of_each, prod.is_packet, prod.packet_weight, prod.packet_unit_id, 1];
                connection.query(`INSERT INTO products_measurement (product_id, unit_value, unit_id, price, price_per_unit, is_packet, packet_weight, packet_unit_id, is_active) VALUES (?)`, [insertValues], function (error, rows, fields) {
                  if (error) {  console.log("Error...", error); reject(error);  }
                  resolve(rows.insertId)
                });
              });
            }else{
              resolve()
            }
          }else{
            resolve()
          }
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
        connection.query(`INSERT INTO orders(order_id, user_id, shipping_id, order_date, status, is_active, created_by) 
                          VALUES ((SELECT UPPER(CONCAT('O',
                          CASE LENGTH(CONVERT((IFNULL((SELECT o.id FROM orders as o ORDER BY o.id DESC LIMIT 1),0) + 1), CHAR)) 
                          WHEN 1 THEN '000000' WHEN 2 THEN '00000' WHEN 3 THEN '0000' WHEN 4 THEN '000' WHEN 5 THEN '00' WHEN 6 THEN '0' WHEN 7 THEN '' END,
                          CONVERT((IFNULL((SELECT o.id FROM orders as o ORDER BY o.id DESC LIMIT 1),0) + 1), CHAR)))),
                          ${that.createdBy}, ${that.shipping_id}, '${that.order_date}', 1, 1, ${that.createdBy});`, 
          function (error, orderResult, fields) {
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


Order.prototype.insertOrderedProduct = function (Values) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      connection.changeUser({database : dbName});

      // let product = [that.createdBy, that.order_id, Math.ceil(Math.random() *1000000000), data.id, data.quantity, data.selected_unit_id, 1, 1, that.createdBy]

      connection.query('INSERT INTO ordered_product( user_id, order_id, tracking_id, product_id, quantity, unit_id, status, is_active, created_by) VALUES ?', [Values], function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);}
          resolve(rows);
      });

    connection.release();
    console.log('Process Complete %d', connection.threadId);
    });
  });
} 

































// Order.prototype.getOrderedProduct = function () {
//   const that = this;
//   return new Promise(function (resolve, reject) {
//     connection.getConnection(function (error, connection) {
//       if (error) {
//         throw error;
//       }
//       connection.changeUser({database : dbName});
//       let Query = ``;
//       if(that.is_date_range === 1){
//         if(that.order_status ==  1){
//           Query  = `SELECT op.id, op.user_id, op.order_id, p.product_name, unit.unit_name as ordered_unit_name, op.tracking_id, op.product_id, op.quantity, op.unit_id,  op.status FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = op.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status = ${that.order_status} AND (DATE_FORMAT(order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}'))`;
//         }else if (that.order_status == 2){
//           Query = `SELECT op.id as ordered_id,  op.order_id, op.user_id, dp.product_id, dp.paid_quantity as quantity, dp.unit_id, dp.price, p.product_name, unit.unit_name as ordered_unit_name FROM delivered_product as dp INNER JOIN ordered_product as op on op.id = dp.ordered_id INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = dp.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status != 1 AND (DATE_FORMAT(order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}'))`
//         }else {
//           Query = `SELECT op.id as ordered_id, op.order_id, op.user_id, dp.product_id, dp.paid_quantity as quantity, dp.unit_id, dp.price, p.product_name, unit.unit_name as ordered_unit_name, vp.quantity as verified_quantity, ur.unit_name as verified_unit_name, vp.unit_id as verified_unit_id FROM delivered_product as dp INNER JOIN ordered_product as op on op.id = dp.ordered_id INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = dp.unit_id LEFT JOIN verified_product as vp ON vp.delivered_id = dp.id AND vp.ordered_id = op.id INNER JOIN unit_records as ur ON ur.id = vp.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status != 1 AND (DATE_FORMAT(order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}'))`
//         }
//       }
//       else if(that.is_date_range === 0){
//         if(that.order_status ==  1 ){
//           Query  = `SELECT op.id, op.user_id, op.order_id, p.product_name, unit.unit_name as ordered_unit_name, op.tracking_id, op.product_id, op.quantity, op.unit_id,  op.status FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = op.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status = ${that.order_status} AND  (DATE_FORMAT(order_date, '%Y-%m-%d') = '${that.date}'))`;
//         }else if (that.order_status ==  2){
//           Query = `SELECT op.id as ordered_id, op.order_id, op.user_id, dp.product_id, dp.paid_quantity as quantity, dp.unit_id, dp.price, p.product_name, unit.unit_name as ordered_unit_name FROM delivered_product as dp INNER JOIN ordered_product as op on op.id = dp.ordered_id INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = dp.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status != 1 AND  (DATE_FORMAT(order_date, '%Y-%m-%d') = '${that.date}'))`
//         }else{
//           Query = `SELECT op.id as ordered_id, op.order_id, op.user_id, dp.product_id, dp.paid_quantity as quantity, dp.unit_id, dp.price, p.product_name, unit.unit_name as ordered_unit_name, vp.quantity as verified_quantity, ur.unit_name as verified_unit_name, vp.unit_id as verified_unit_id FROM delivered_product as dp INNER JOIN ordered_product as op on op.id = dp.ordered_id INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = dp.unit_id LEFT JOIN verified_product as vp ON vp.delivered_id = dp.id AND vp.ordered_id = op.id INNER JOIN unit_records as ur ON ur.id = vp.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status != 1 AND  (DATE_FORMAT(order_date, '%Y-%m-%d') = '${that.date}'))`
//         }
//       }
//       console.log(Query);
//       connection.query(Query, function (error, rows, fields) {
//         if (error) {  console.log("Error...", error); reject(error);  }
//         resolve(rows);
//       });
//         connection.release();
//         console.log('Process Complete %d', connection.threadId);
//     });
//   });
// } 





Order.prototype.getCustomerOrderedProduct = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = ``;
    
      if(that.order_status ==  1){
        Query  = `SELECT op.id, op.user_id, op.order_id, p.product_name, unit.unit_name as ordered_unit_name, op.tracking_id, op.product_id, op.quantity, op.unit_id,  op.status FROM ordered_product as op INNER JOIN products as p ON p.id = op.product_id  INNER JOIN unit_records as unit ON unit.id = op.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status = ${that.order_status} AND user_id = ${that.createdBy} AND (DATE_FORMAT(order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}'))`;
      }else if (that.order_status !=  1){
        Query  = `SELECT op.id, op.order_id, op.user_id, op.status, op.product_id, unit.unit_name as delivered_unit_name, dp.delivery_date, dp.id as delivered_id, dp.unit_id,  p.product_name FROM delivered_product as dp INNER JOIN ordered_product as op on op.id = dp.ordered_id INNER JOIN products as p ON p.id = op.product_id INNER JOIN unit_records as unit ON unit.id = dp.unit_id WHERE op.order_id IN(SELECT id from orders WHERE is_active = 1 AND status != 1 AND user_id = ${that.createdBy}  AND (DATE_FORMAT(order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}'))`
      }

      connection.query(Query, function (error, rows, fields) {
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
      let Query = ``;
      if(that.order_status === 1){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email, 
                sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, op.quantity, op.unit_id, op.product_id, 
                p.product_name, ur.unit_name FROM orders as o 
                INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                INNER JOIN ordered_product as op ON op.order_id = o.id
                INNER JOIN products as p ON p.id = op.product_id
                INNER JOIN unit_records as ur ON ur.id = op.unit_id
                WHERE o.is_active = 1 AND o.status = 1 AND (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}');`
        
      }else if(that.order_status === 2){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email,
                sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date, dp.product_id, 
                dp.paid_quantity as quantity, dp.unit_id, dp.price, ur.unit_name, p.product_name
                FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                LEFT JOIN  delivered_product  as dp ON dp.order_id = o.id
                INNER JOIN unit_records as ur ON ur.id = dp.unit_id
                INNER JOIN products as p ON p.id = dp.product_id
                WHERE o.is_active = 1 AND o.status = 2 AND (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}')`
      }else if(that.order_status === 3){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email, sd.pincode,
                sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date, dp.product_id, dp.id as delivered_id,
                dp.paid_quantity as quantity, dp.unit_id, dp.price, ur.unit_name, p.product_name, vp.quantity as verified_quantity, 
                vp.unit_id as verified_unit_id, ur2.unit_name as verified_unit_name
                FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                LEFT JOIN  delivered_product  as dp ON dp.order_id = o.id
                INNER JOIN unit_records as ur ON ur.id = dp.unit_id
                INNER JOIN products as p ON p.id = dp.product_id
                INNER JOIN verified_product as vp ON vp.delivered_id = dp.id
                INNER JOIN unit_records as ur2 ON ur2.id = vp.unit_id
                WHERE o.is_active = 1 AND o.status IN(3,4) AND (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}')`;       
      }
      // if(that.order_status != 3){
      //   Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status,  sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN ordered_product as op ON op.order_id = o.id LEFT JOIN  delivered_product  as dp ON dp.ordered_id = op.id WHERE o.is_active = 1 AND o.status = ${that.order_status} AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}') GROUP BY op.order_id`;
      // }else if (that.order_status == 3){
      //   Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status,  sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN ordered_product as op ON op.order_id = o.id LEFT JOIN  delivered_product  as dp ON dp.ordered_id = op.id WHERE o.is_active = 1 AND o.status IN(3,4) AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}') GROUP BY op.order_id`
      // }
      // console.log(Query)
      connection.query(Query , function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Order.prototype.getOrderListOfSingleDay = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = ``;      
      if(that.order_status === 1){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email, 
                sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, op.quantity, op.unit_id, op.product_id, 
                p.product_name, ur.unit_name FROM orders as o 
                INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                INNER JOIN ordered_product as op ON op.order_id = o.id
                INNER JOIN products as p ON p.id = op.product_id
                INNER JOIN unit_records as ur ON ur.id = op.unit_id
                WHERE o.is_active = 1 AND o.status = 1 AND (DATE_FORMAT(o.order_date, '%Y-%m-%d') = '${that.date}');`
        
      }else if(that.order_status === 2){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email,
                sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date, dp.product_id, 
                dp.paid_quantity as quantity, dp.unit_id, dp.price, ur.unit_name, p.product_name
                FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                LEFT JOIN  delivered_product  as dp ON dp.order_id = o.id
                INNER JOIN unit_records as ur ON ur.id = dp.unit_id
                INNER JOIN products as p ON p.id = dp.product_id
                WHERE o.is_active = 1 AND o.status = 2 AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') = '${that.date}');`
      }else if(that.order_status === 3){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email, sd.pincode,
                sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date, dp.product_id, dp.id as delivered_id,
                dp.paid_quantity as quantity, dp.unit_id, dp.price, ur.unit_name, p.product_name, vp.quantity as verified_quantity, 
                vp.unit_id as verified_unit_id, ur2.unit_name as verified_unit_name
                FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                LEFT JOIN  delivered_product  as dp ON dp.order_id = o.id
                INNER JOIN unit_records as ur ON ur.id = dp.unit_id
                INNER JOIN products as p ON p.id = dp.product_id
                INNER JOIN verified_product as vp ON vp.delivered_id = dp.id
                INNER JOIN unit_records as ur2 ON ur2.id = vp.unit_id
                WHERE o.is_active = 1 AND o.status IN(3,4) AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') = '${that.date}');`;
      }
      // if(that.order_status == 1 || that.order_status == 2){
      //   Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN ordered_product as op ON op.order_id = o.id LEFT JOIN  delivered_product  as dp ON dp.ordered_id = op.id WHERE o.is_active = 1 AND o.status = ${that.order_status} AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') = '${that.date}')  GROUP BY op.order_id`;
      // }else if(that.order_status == 3 || that.order_status == 4 || that.order_status == 5){
      //   Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN ordered_product as op ON op.order_id = o.id LEFT JOIN  delivered_product  as dp ON dp.ordered_id = op.id WHERE o.is_active = 1 AND o.status IN(3,4) AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') = '${that.date}')  GROUP BY op.order_id`;
      // }
      // console.log(Query);
      connection.query(Query, function (error, rows, fields) {
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
      let Query = ``;
      if(that.order_status === 1){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email, 
                 sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, op.quantity, op.unit_id, op.product_id, 
                 p.product_name, ur.unit_name 
                 FROM orders as o 
                INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                INNER JOIN ordered_product as op ON op.order_id = o.id
                INNER JOIN products as p ON p.id = op.product_id
                INNER JOIN unit_records as ur ON ur.id = op.unit_id
                WHERE o.is_active = 1 AND o.user_id = ${that.createdBy} AND o.status = 1 AND (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}');`;
      }else if(that.order_status === 2){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email,
                sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date, dp.id as delivered_id, dp.product_id, 
                dp.paid_quantity as quantity, dp.unit_id, dp.price, ur.unit_name, p.product_name
                FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                LEFT JOIN  delivered_product  as dp ON dp.order_id = o.id
                INNER JOIN unit_records as ur ON ur.id = dp.unit_id
                INNER JOIN products as p ON p.id = dp.product_id
                WHERE o.is_active = 1 AND o.user_id = ${that.createdBy} AND o.status = 2 AND (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}');`
      }else if(that.order_status === 3){
        Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status, sd.full_name, sd.mobile, sd.email,
                sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date, p.product_name
                FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id
                LEFT JOIN  delivered_product  as dp ON dp.order_id = o.id                
                INNER JOIN products as p ON p.id = dp.product_id
                WHERE o.is_active = 1 AND o.user_id = ${that.createdBy} AND o.status IN(3,4) AND (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}');`
      }


      // if(that.order_status == 1 || that.order_status == 2){
      //   Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status,  sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN ordered_product as op ON op.order_id = o.id LEFT JOIN  delivered_product  as dp ON dp.ordered_id = op.id WHERE o.is_active = 1 AND o.status = ${that.order_status} AND o.user_id = ${that.createdBy} AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}') GROUP BY op.order_id`;
      // }else if(that.order_status == 3  || that.order_status == 4 || that.order_status == 5){
      //   Query = `SELECT o.id, o.order_id, o.user_id, o.order_date, o.status,  sd.full_name, sd.mobile, sd.email, sd.pincode, sd.flat_add, sd.street_add, sd.state, sd.city, dp.delivery_date FROM orders as o INNER JOIN shipping_details as sd ON o.shipping_id = sd.id INNER JOIN ordered_product as op ON op.order_id = o.id LEFT JOIN  delivered_product  as dp ON dp.ordered_id = op.id WHERE o.is_active = 1 AND o.status IN(3,4) AND o.user_id = ${that.createdBy} AND  (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}') GROUP BY op.order_id`;
      // }
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Order.prototype.orderVerificationByCustomer = function (Values) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({database : dbName});
      
      connection.query('UPDATE delivered_product SET status = "4" WHERE id IN('+that.delivered_id+');', function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        connection.query('INSERT INTO verified_product(order_id, delivered_id, product_id, quantity, unit_id, is_active) VALUES ?;', [Values], function (error, rows, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve(rows);
        });
      });
    connection.release();
    console.log('Process Complete %d', connection.threadId);
    });
  });
}


Order.prototype.changeOrderStatus = function (data) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({database : dbName});
      connection.query(`UPDATE orders SET status = '${data.status}' WHERE id = '${data.orderId}';`, function (error, rows, fields) {
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





Order.prototype.getDeliveryData = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query('SELECT id, id AS delivered_id, product_id, unit_id, paid_quantity AS quantity FROM delivered_product WHERE order_id = '+ that.orderId + ';', function (error, rows, fields) {
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
      // let Query = `SELECT op.id, op.user_id, op.order_id, op.tracking_id, op.product_id, op.quantity, op.unit_id, op.status, op.is_active, p.product_name, p.main_unit_id, unit.unit_name, unit.id as unit_table_id, unit.equal_value_of_parent, pm.unit_value, pm.price, pm.is_packet, pm.packet_weight, pm.packet_unit_id from ordered_product as op INNER JOIN products AS p ON p.id = op.product_id INNER JOIN unit_records as unit ON unit.id = p.main_unit_id INNER JOIN products_measurement as pm ON pm.product_id = op.product_id AND pm.unit_id = op.unit_id WHERE op.order_id IN(SELECT id FROM orders WHERE is_active = 1 AND (DATE_FORMAT(order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}'))`;
      // let Query = `SELECT o.user_id, u.name as user_name, op.product_id, p.product_name, SUM(op.quantity) as quantity, op.unit_id, p.main_unit_id, p.sub_category_id, c.category_name as sub_category_name, pm.unit_value, pm.price, pm.is_packet, pm.packet_weight, pm.packet_unit_id FROM orders as o INNER JOIN ordered_product as op ON o.id = op.order_id INNER JOIN users as u ON o.user_id = u.id INNER JOIN products AS p ON p.id = op.product_id INNER JOIN categories as c ON c.id = p.sub_category_id INNER JOIN products_measurement as  pm ON pm.product_id = op.product_id AND pm.unit_id = op.unit_id WHERE (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}') AND o.status = 1 GROUP BY user_id, product_id, unit_id ORDER BY op.product_id ASC`;
      // let Query = `SELECT o.user_id, u.name as user_name, op.product_id, p.product_name, SUM(op.quantity) as quantity, op.unit_id, p.main_unit_id, p.sub_category_id, c.category_name as sub_category_name, pm.unit_value, pm.price, pm.is_packet, pm.packet_weight, pm.packet_unit_id FROM orders as o INNER JOIN ordered_product as op ON o.id = op.order_id INNER JOIN users as u ON o.user_id = u.id INNER JOIN products AS p ON p.id = op.product_id INNER JOIN categories as c ON c.id = p.sub_category_id INNER JOIN products_measurement as  pm ON pm.product_id = op.product_id AND pm.unit_id = op.unit_id  GROUP BY user_id, product_id, unit_id ORDER BY op.product_id ASC`;
      let Query = `SELECT o.user_id, u.name as user_name, u.user_id as login_id,  GROUP_CONCAT(op.unit_id) as ordered_unit_id, GROUP_CONCAT(op.quantity) as ordered_quantity, GROUP_CONCAT(ur.unit_name) as ordered_unit_name, op.product_id, p.product_name, SUM(CASE pm.is_packet WHEN 1 THEN (pm.packet_weight * op.quantity) WHEN 0 THEN op.quantity END) as quantity, (CASE pm.is_packet WHEN 1 THEN pm.packet_unit_id WHEN 0 THEN op.unit_id END) as unit_id, p.main_unit_id, p.sub_category_id, c.category_name as sub_category_name FROM orders as o INNER JOIN ordered_product as op ON o.id = op.order_id INNER JOIN users as u ON o.user_id = u.id INNER JOIN products AS p ON p.id = op.product_id INNER JOIN categories as c ON c.id = p.sub_category_id INNER JOIN products_measurement as  pm ON pm.product_id = op.product_id AND pm.unit_id = op.unit_id AND pm.is_active = 1 INNER JOIN unit_records as ur ON ur.id = op.unit_id WHERE (DATE_FORMAT(o.order_date, '%Y-%m-%d') BETWEEN '${that.from_date}' AND '${that.to_date}') AND o.status = 1 `;
        if(that.user_ids !== 0){
          Query = Query + ` AND o.user_id IN(${that.user_ids}) `
        }
          Query = Query + ` GROUP BY user_id, product_id, unit_id ORDER BY op.product_id, user_id ASC `;
      // console.log(Query)
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}



Order.prototype.getOrderedProductListSingleDay = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      // let Query = `SELECT op.id, op.user_id, op.order_id, op.tracking_id, op.product_id, op.quantity, op.unit_id, op.status, op.is_active, p.product_name, p.main_unit_id, unit.unit_name, unit.id as unit_table_id, unit.equal_value_of_parent, pm.unit_value, pm.price, pm.is_packet, pm.packet_weight, pm.packet_unit_id from ordered_product as op INNER JOIN products AS p ON p.id = op.product_id INNER JOIN unit_records as unit ON unit.id = p.main_unit_id INNER JOIN products_measurement as pm ON pm.product_id = op.product_id AND pm.unit_id = op.unit_id AND pm.is_active = 1 WHERE op.order_id IN(SELECT id FROM orders WHERE is_active = 1 AND (DATE_FORMAT(order_date, '%Y-%m-%d')  = '${that.date}'))`;
      // let Query = `SELECT op.product_id, p.product_name, 
      // SUM(CASE pm.is_packet WHEN 1 THEN (pm.packet_weight * op.quantity) WHEN 0 THEN op.quantity END) as quantity, 
      // (CASE pm.is_packet WHEN 1 THEN pm.packet_unit_id WHEN 0 THEN op.unit_id END) as unit_id, 
      // p.main_unit_id, p.sub_category_id, p.category_id, pm.price FROM orders as o INNER JOIN ordered_product as op ON o.id = op.order_id INNER JOIN products AS p ON p.id = op.product_id INNER JOIN products_measurement as  pm ON pm.product_id = op.product_id AND pm.unit_id = op.unit_id AND pm.is_active = 1
      // WHERE (DATE_FORMAT(o.order_date, '%Y-%m-%d') = '${that.date}') AND o.status = 1 GROUP BY product_id, unit_id ORDER BY op.product_id ASC`;

      // let Query = `SELECT op.product_id, p.product_name, SUM(op.quantity) as quantity, op.unit_id, p.main_unit_id, p.sub_category_id,
      //     p.category_id, pm.price, pm.price_per_unit, pm.is_packet FROM orders as o INNER JOIN ordered_product as op ON o.id = op.order_id
      //     INNER JOIN products AS p ON p.id = op.product_id INNER JOIN products_measurement as  pm ON pm.product_id = op.product_id 
      //     AND pm.unit_id = op.unit_id AND pm.is_active = 1 WHERE (DATE_FORMAT(o.order_date, '%Y-%m-%d') = '${that.date}') AND o.status = 1
      //     GROUP BY product_id, unit_id ORDER BY op.product_id ASC`

      let Query = `SELECT op.product_id, p.product_name, SUM(op.quantity) as quantity, op.unit_id, ur.unit_name, p.main_unit_id, ur2.unit_name as main_unit_name, 
          p.sub_category_id, p.category_id, pm.price, pm.price_per_unit, pm.is_packet FROM orders as o INNER JOIN ordered_product as op ON o.id = op.order_id
          INNER JOIN products AS p ON p.id = op.product_id INNER JOIN products_measurement as pm ON pm.product_id = op.product_id AND pm.unit_id = op.unit_id AND pm.is_active = 1 
          INNER JOIN unit_records as ur ON ur.id = op.unit_id INNER JOIN unit_records as ur2 ON ur2.id = p.main_unit_id WHERE (DATE_FORMAT(o.order_date, '%Y-%m-%d') = '${that.date}') 
          GROUP BY product_id, unit_id ORDER BY op.id ASC`;
      // console.log(Query)
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}




Order.prototype.getDailyPurchaseRecords = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      // let Query = `SELECT id, product_id, purchase_date, required_quantity, required_unit_id, purchased_quantity, purchased_unit_id, cost, cost_of_each, status, is_active FROM purchase_register WHERE is_active = 1 AND product_id IN(${that.product_id}) AND (DATE_FORMAT(purchase_date, '%Y-%m-%d')  = '${that.date}')`;
      // let Query = `SELECT id, product_id, purchase_date, required_quantity, required_unit_id, purchased_quantity, purchased_unit_id, cost, cost_of_each, status, is_active FROM purchase_register WHERE is_active = 1 AND (DATE_FORMAT(purchase_date, '%Y-%m-%d')  = '${that.date}')`;
      // let Query = `SELECT pr.id, pr.product_id, pr.purchase_date, pr.required_quantity, pr.required_unit_id, pr.purchased_quantity, pr.purchased_unit_id, pr.cost, pr.cost_of_each, pr.is_extra, pr.status, pr.is_active, p.category_id, p.sub_category_id, p.main_unit_id, p.product_name, ur.unit_name FROM purchase_register as pr INNER JOIN products as p ON p.id = pr.product_id INNER JOIN unit_records as ur ON ur.id = p.main_unit_id WHERE pr.is_active = 1 AND (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d')  = '${that.date}')`
      let Query = `SELECT pr.id, pr.product_id, pr.purchase_date, pr.required_quantity, pr.required_unit_id, pr.purchased_quantity, pr.purchased_unit_id, pr.cost, pr.cost_of_each, pr.is_extra, pr.status, pr.is_active, p.category_id, p.sub_category_id, p.main_unit_id, p.product_name, ur.unit_name as main_unit_name, ur2.unit_name, pm.price, pm.price_per_unit FROM purchase_register as pr INNER JOIN products as p ON p.id = pr.product_id INNER JOIN unit_records as ur ON ur.id = p.main_unit_id INNER JOIN unit_records as ur2 ON ur2.id = pr.purchased_unit_id LEFT JOIN products_measurement as pm ON pm.product_id = pr.product_id AND pm.unit_id = pr.purchased_unit_id AND pm.is_active = 1 WHERE pr.is_active = 1 AND (DATE_FORMAT(pr.purchase_date, '%Y-%m-%d')  = '${that.date}');`;
      // console.log(Query)
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
