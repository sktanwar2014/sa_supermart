const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const Categories = function (params) {
  
};


Categories.prototype.getMainCategoryList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM categories where is_active = 1`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


module.exports = Categories;
