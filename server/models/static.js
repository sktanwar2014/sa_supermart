const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const StaticModel = function (params) {
  this.id = params.id;
  this.is_bundle = params.is_bundle;
};


StaticModel.prototype.getProductUnitList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM unit_records WHERE is_active = 1`, function (error, rows, fields) {
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
        Query = `SELECT * FROM unit_records WHERE id = ${that.id} OR parent_id = ${that.id} OR id = (SELECT parent_id FROM unit_records WHERE id = ${that.id}) OR is_bundle = 1`;
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

module.exports = StaticModel;
