const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const CommonModal = function (params) {
  this.comment = params.comment;
  this.commentType = params.commentType;
  this.created_by = params.created_by;
  this.tableName = params.tableName;
  this.tableId = params.tableId;
  this.docType = params.docType;
  this.documentName = params.documentName;
};


CommonModal.prototype.postComment = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});
      
      let Query = `INSERT INTO comment_table(type, table_name, table_id, comment, is_active, created_by) VALUES(${that.commentType}, '${that.tableName}', ${that.tableId}, '${that.comment}', 1, ${that.created_by});`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



CommonModal.prototype.insertDocumentEntry = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});
      
      let Query = `INSERT INTO document_table(type, table_name, table_id, document, is_active, created_by) 
                  VALUES (${that.docType}, '${that.tableName}', ${that.tableId}, '${that.documentName}', 1, ${that.created_by});`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 

module.exports = CommonModal;
