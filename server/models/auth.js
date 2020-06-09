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
  this.pageNo = params.pageNo;
  this.isActive = params.isActive;
  this.status = params.status;
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
        connection.query(`SELECT id, name, token, account_id, role_id, user_id, status, is_mail_verified, is_active FROM users WHERE user_id = '${that.user_id}' AND password = AES_ENCRYPT('${that.password}','secret') AND is_active = 1`, function (error, rows, fields) { 
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
      connection.query(`INSERT INTO users(name, user_id, password, token, account_id, role_id, is_mail_verified, status, is_active) VALUES ('${that.firstname +" " + that.lastname}', '${that.user_id}', AES_ENCRYPT('${that.password}', "secret"), '${that.token}', '${that.accountId}', 2, 0, 0, 1);`, function (error, user, fields) { 
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


Auth.prototype.resendEmailVarificationLink = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({database : dbName});
      connection.query(`UPDATE users as u INNER JOIN profile as p ON p.user_id = u.id SET u.token = '${that.token}', p.email = '${that.email}' WHERE u.id = ${that.user_id}`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        connection.query(`SELECT name as firstname, token, account_id, user_id, AES_DECRYPT(password, 'secret') as password FROM users WHERE id = ${that.user_id}`, function (error, user, fields) {
          if (error) {  console.log("Error...", error); reject(error);  }
          let data = user[0];
              let pass = data.password.toString('utf8');
              data.password = pass;
          resolve(data);
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
      connection.query(`SELECT id, name, token, account_id, role_id, user_id, is_mail_verified, is_active FROM users WHERE id != 1 AND status = 1 AND is_active = 1`, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }          
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Auth.prototype.getClientList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      connection.changeUser({database : dbName});
      connection.query(`SELECT u.id, u.name, u.user_id, AES_DECRYPT(u.password, 'secret') as password, u.is_mail_verified, u.status, u.is_active, u.created_at, p.email, p.mobile FROM users as u INNER JOIN profile as p ON p.user_id = u.id WHERE u.id != 1 ORDER BY u.id DESC LIMIT ${((that.pageNo * 20) - 20)},20 `, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        let datas = [];
        (rows && rows.length > 0 ? rows : []).map(data =>{
          let pass = data.password.toString('utf8');
          data.password = pass;
          datas.push(data);
        });
        resolve(datas);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Auth.prototype.getTotalClientsCount = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({database : dbName});
      connection.query(`SELECT COUNT(u.id) as total_client FROM users as u INNER JOIN profile as p ON p.user_id = u.id WHERE u.id != 1`, function (error, rows, fields) { 
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
      connection.query(`UPDATE users SET is_mail_verified = 1, token = null WHERE user_id = '${that.user_id}' AND account_id = '${that.accountId}' AND token = '${that.token}' `, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }        
        resolve(rows.changedRows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}


Auth.prototype.handleClientActivation = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.changeUser({database : dbName});
      connection.query(`UPDATE users SET status = ${that.status} WHERE id = ${that.user_id}`, function (error, rows, fields) { 
        if (error) {  console.log("Error...", error); reject(error);  }        
        resolve(rows.changedRows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}

module.exports = Auth;
