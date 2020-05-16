const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const UnitsModel = function (params) {
  this.unit_name = params.unit_name;
  this.default_weight = params.default_weight;
  this.group_id = params.group_id;
//   this.is_bundle = params.is_bundle;
};


UnitsModel.prototype.getLastGroupId = function () {
    const that = this;
    return new Promise(function (resolve, reject) {
      connection.getConnection(function (error, connection) {
        if (error) {
          throw error;
        }
        connection.changeUser({database : dbName});
        connection.query(`SELECT Max(group_id) as group_id FROM unit_records`, function (error, rows, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve(rows[0].group_id);
        });
          connection.release();
          console.log('Process Complete %d', connection.threadId);
      });
    });
  } 
  
  

UnitsModel.prototype.setNewPacketUnit = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`INSERT INTO unit_records(unit_name, default_weight, is_bundle, group_id, sequence, parent_id, equal_value_of_parent, is_active) VALUES ('${that.unit_name}', 1, 1, 0, 0, 0, 0, 1)`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




UnitsModel.prototype.setNewUnit = function () {
    const that = this;
    return new Promise(function (resolve, reject) {
      connection.getConnection(function (error, connection) {
        if (error) {
          throw error;
        }
        connection.changeUser({database : dbName});
        connection.query(`INSERT INTO unit_records(unit_name, default_weight, is_bundle, group_id, sequence, parent_id, equal_value_of_parent, is_active) VALUES (?)`, [[that.unit_name, that.default_weight, 0, that.group_id, 1, 0, 0, 1]], function (error, rows, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve(rows);
        });
          connection.release();
          console.log('Process Complete %d', connection.threadId);
      });
    });
  } 



module.exports = UnitsModel;
