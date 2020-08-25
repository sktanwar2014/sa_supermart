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
        
        let Query = `INSERT INTO invoice_versions(invoice_id, invoice_no, version_no, status, is_active, created_by) VALUES (?);`
        let Values = [that.invoice_id, that.invoice_no, that.version_no, 1, 1, that.created_by];
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



Invoices.prototype.generateInvoiceItems = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});
      let Query = `INSERT INTO invoice_items(invoice_id, invoice_version_id, item_type_id, item_id, unit_id, item_name, unit_name, unit_price, quantity, total_amt, is_active) VALUES (?);`
      
      Object.values(that.itemList).map((data, index) => {
        let Values = [that.invoice_id, that.invoice_version_id, 1, data.item_id, data.unit_id, data.item_name, data.unit_name, data.unit_price, data.quantity, data.total_amt, 1];
        connection.query(Query, [Values], function (error, result, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve(result);
        });
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

module.exports = Invoices;
