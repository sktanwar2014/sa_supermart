const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const SettingsModal = function (params) {
  this.type = params.type;
  this.userId = params.userId;
  this.orderId = params.orderId;
  this.settingList = params.settingList;
};


SettingsModal.prototype.getSettings = function () {
    const that = this;
    return new Promise(function (resolve, reject) {
      connection.getConnection(function (error, connection) {
        if (error) { throw error; }
        connection.changeUser({database : dbName});

        let Query = `SELECT s.id, sl.id AS setting_list_id, sl.type, sl.setting, sl.description, s.user_id, (CASE WHEN s.is_active IS NULL THEN 0 ELSE s.is_active END) as is_active FROM setting_list AS sl LEFT JOIN settings AS s ON sl.id = s.setting_id AND sl.is_active = 1 AND (s.user_id IS NULL OR s.user_id = ${that.userId})`;
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
  
  
  
SettingsModal.prototype.checkUserAutomationSettings = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      connection.changeUser({database : dbName});

      let Query = `SELECT s.is_active FROM settings AS s INNER JOIN users AS u ON s.user_id = u.id AND s.setting_id = 1 INNER JOIN orders AS o ON o.user_id = u.id WHERE o.id = ${that.orderId}`;
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

  SettingsModal.prototype.updateAutomationSettings = function () {
    const that = this;
    return new Promise(function (resolve, reject) {
      connection.getConnection(function (error, connection) {
        if (error) { throw error; }
        connection.changeUser({database : dbName});

        Object.values(that.settingList).map((data, index) => {
          connection.query(`SELECT * FROM settings WHERE user_id = '${that.userId}' AND setting_id = '${data.setting_list_id}';`, function (error, rows, fields) {
            if (error) {  console.log("Error...", error); reject(error);  }
              if(rows.length > 0){
                connection.query(`UPDATE settings SET is_active = ${data.is_active}, updated_at = now() WHERE user_id = '${that.userId}' AND setting_id = '${data.setting_list_id}';`, function (error, updateResult, fields) {
                  if (error) {  console.log("Error...", error); reject(error);  }
                  resolve(updateResult);
                });
              }else{
                connection.query(`INSERT INTO settings(user_id, setting_id, is_active) VALUES('${that.userId}', '${data.setting_list_id}', '${data.is_active}');`, function (error, updateResult, fields) {
                  if (error) {  console.log("Error...", error); reject(error);  }
                  resolve(updateResult);
                });
              }
          });
        });
        
          connection.release();
          console.log('Process Complete %d', connection.threadId);
      });
    });
  } 


module.exports = SettingsModal;
