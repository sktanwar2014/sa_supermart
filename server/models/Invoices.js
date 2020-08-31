const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");
const {isNullOrUndefined} = require('util');
const {invoiceNoGenerator} = require('../utils/utils.js');

const Invoices = function (params) {  
  this.order_id = params.orderId;
  this.customer_type = params.customer_type;
  this.invoice_type = params.invoice_type;
  this.customer_id = params.customer_id;
  this.created_by = params.created_by;
  this.invoice_id = params.invoice_id;
  this.invoice_version_id = params.invoice_version_id;
  this.invoice_no = params.invoice_no;
  this.version_no = params.version_no;
  this.itemList = params.itemList;  
  this.sub_total = params.sub_total;
  this.total_subtraction = params.total_subtraction;
  this.total_addition = params.total_addition;
  this.total = params.total;
  this.status = params.status;
  this.userId = params.userId;
  this.userRole = params.userRole;
};



Invoices.prototype.generateInvoice = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});

      let Query = `INSERT INTO invoice(order_id, customer_type, customer_id, invoice_type, status, is_active, created_by) VALUES (?);`
      let Values = [that.order_id, that.customer_type, that.customer_id, that.invoice_type, 1, 1, that.created_by];
      
      connection.query(Query, [Values], function (error, result, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(result.insertId);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Invoices.prototype.generateNewVersionOfInvoice = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});

      connection.query(`SELECT * FROM invoice_versions WHERE invoice_id = ${that.invoice_id} ORDER BY version_no DESC;`, function (error, invoices, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }        
        if(isNullOrUndefined(invoices) || invoices === "" || invoices.length === 0){
          that.invoice_no = invoiceNoGenerator(that.invoice_id, '');
          that.version_no = 0;
        }else{
          let lastInvoice = invoices[0];
          that.version_no = Number(lastInvoice.version_no + 1);
          that.invoice_no = invoiceNoGenerator(that.invoice_id, that.version_no);
        }
        
        let Query = `INSERT INTO invoice_versions(invoice_id, invoice_no, version_no, invoice_date, status, is_active, created_by) VALUES (?);`
        let Values = [that.invoice_id, that.invoice_no, that.version_no, new Date(), 1, 1, that.created_by];
        connection.query(Query, [Values], function (error, result, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve(result.insertId);
        });
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Invoices.prototype.generateInvoiceItems = function (itemListValues) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});
      
      let Query = `INSERT INTO invoice_items(invoice_id, invoice_version_id, item_type_id, item_id, unit_id, item_name, unit_name, unit_price, quantity, total_amt, status, is_active) VALUES ?;`
      connection.query(Query, [itemListValues], function (error, result, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve(result);
      });
        
      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Invoices.prototype.generateInvoiceBilling = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});

      let Query = `INSERT INTO invoice_billing(invoice_id, invoice_version_Id, sub_total, total_subtraction, total_addition, total, status, is_active) VALUES (?);`
      let Values = [that.invoice_id, that.invoice_version_id, that.sub_total, that.total_subtraction, that.total_addition, that.total, 0, 1];
      connection.query(Query, [Values], function (error, result, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(result.insertId);
      });
        
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}  



Invoices.prototype.getInvoiceList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }      
      connection.changeUser({database : dbName});      
      let Query = '';

      if(that.userRole !== 1 && that.userRole === 2){
        Query = `SELECT o.order_id, iv.invoice_id, iv.id AS invoice_version_id, iv.invoice_no, iv.version_no, iv.invoice_date, iv.status, ib.total AS invoice_total, ist.state_name AS status_name  FROM orders as o 
                INNER JOIN invoice as i ON i.order_id = o.id
                INNER JOIN invoice_versions AS iv ON i.id = iv.invoice_id
                INNER JOIN invoice_billing AS ib ON ib.invoice_version_Id = iv.id
                INNER JOIN invoice_state AS ist ON ist.id = iv.status
                WHERE o.status = 4 AND o.created_by = ${that.userId}
                ORDER BY iv.invoice_id, iv.version_no ASC ;`;
      }else if(that.userRole === 1 && that.userId === 1){
        Query = '';
      }
      
      // let Values = [that.order_id, that.customer_type, that.customer_id, that.invoice_type, 1, 1, that.created_by];
      
      connection.query(Query, function (error, result, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(result);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Invoices.prototype.getItemsForUpdateRequest = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }      
      connection.changeUser({database : dbName});     
      connection.query(`SELECT * FROM invoice_items WHERE invoice_id = ${that.invoice_id} AND invoice_version_id = ${that.invoice_version_id} AND is_active = 1;`, function (error, result, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(result);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




module.exports = Invoices;
