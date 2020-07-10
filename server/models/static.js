const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const StaticModel = function (params) {
  this.id = params.id;
  this.is_bundle = params.is_bundle;
  this.productId = params.productId;
};


StaticModel.prototype.getProductUnitList = function () {  
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM unit_records WHERE is_active = 1 ORDER BY  group_id, sequence`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 

StaticModel.prototype.getOrderStatusList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM order_status WHERE is_active = 1`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



StaticModel.prototype.getMainUnitRelateRecords = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});

      let Query = ``;
      if(that.is_bundle === 0){
        // Query = `SELECT * FROM unit_records WHERE id = ${that.id} OR parent_id = ${that.id} OR id = (SELECT parent_id FROM unit_records WHERE id = ${that.id}) OR is_bundle = 1`;
        Query = `SELECT * FROM unit_records WHERE id = ${that.id} OR group_id = (SELECT group_id FROM unit_records WHERE id = ${that.id}) OR is_bundle = 1 ORDER BY sequence DESC`;
      }else if(that.is_bundle === 1){
        Query = `SELECT * FROM unit_records WHERE is_bundle = 0`;
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




StaticModel.prototype.getMeasuredUnitofProduct = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});

      let Query = `SELECT ur.id, ur.unit_name  FROM products_measurement as pm INNER JOIN unit_records as ur ON ur.id = pm.unit_id AND pm.is_active = 1 WHERE product_id = ${that.productId} ORDER BY unit_name;`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



StaticModel.prototype.getAllUnitList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});

      let Query = `SELECT * FROM unit_records ORDER BY group_id, sequence`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 





module.exports = StaticModel;
