const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const Auth = function (params) {
  this.password = params.password;
  this.user_id = params.user_id;
};


Auth.prototype.login = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.changeUser({database : dbName});
      connection.query(`SELECT id, name, token, account_id, role_id, user_id, is_active FROM users WHERE user_id = '${that.user_id}' AND password = AES_ENCRYPT('${that.password}','secret')`, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }          
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Auth.prototype.getUserList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.changeUser({database : dbName});
      connection.query(`SELECT id, name, token, account_id, role_id, user_id, is_active FROM users WHERE id != 1 `, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }          
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




module.exports = Auth;
