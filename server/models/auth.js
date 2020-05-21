const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const Auth = function (params) {
  this.password = params.password;
  this.user_id = params.user_id;
  this.email = params.email;
  this.firstname = params.firstname;
  this.lastname = params.lastname;
  this.mobile = params.mobile;
  this.token = params.token;
  this.accountId = params.accountId;
};


Auth.prototype.login = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.changeUser({database : dbName});
      // connection.query(`SELECT id, name, token, account_id, role_id, user_id, is_active FROM users WHERE user_id = '${that.user_id}' AND password = AES_ENCRYPT('${that.password}','secret') AND is_active = 1 AND status = 1`, function (error, rows, fields) { 
        connection.query(`SELECT id, name, token, account_id, role_id, user_id, status, is_active FROM users WHERE user_id = '${that.user_id}' AND password = AES_ENCRYPT('${that.password}','secret') AND is_active = 1`, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }          
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Auth.prototype.register = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.changeUser({database : dbName});
      connection.query(`INSERT INTO users(name, user_id, password, token, account_id, role_id, status, is_active) VALUES ('${that.firstname +" " + that.lastname}', '${that.user_id}', AES_ENCRYPT('${that.password}', "secret"), '${that.token}', '${that.accountId}', 2, 0, 1);`, function (error, user, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }
        connection.query(`INSERT INTO profile(user_id, type_id, first_name, last_name, email, mobile, status, is_active) VALUES(${user.insertId}, 2, '${that.firstname}', '${that.lastname}', '${that.email}', '${that.mobile}', 1, 1);`, function (error, rows, fields) { 
          if (error) {  console.log("Error...", error); reject(error);  }
          resolve(rows);
        });
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
      connection.query(`SELECT id, name, token, account_id, role_id, user_id, is_active FROM users WHERE id != 1 AND status = 1`, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }          
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Auth.prototype.verifyEmail = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.changeUser({database : dbName});
      connection.query(`SELECT email FROM profile WHERE email = '${that.email}'`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Auth.prototype.verifyUserId = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.changeUser({database : dbName});
      connection.query(`SELECT user_id FROM users WHERE user_id = '${that.user_id}'`, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }          
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Auth.prototype.activateEmail = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.changeUser({database : dbName});
      connection.query(`UPDATE users SET status = true, token = null WHERE user_id = '${that.user_id}' AND account_id = '${that.accountId}' AND token = '${that.token}' `, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }        
        resolve(rows.changedRows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



module.exports = Auth;
