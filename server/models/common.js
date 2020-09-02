const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const CommonModal = function (params) {
  this.comment = params.comment;
  this.commentType = params.commentType;
  this.created_by = params.created_by;
  this.rowId = params.rowId;
  this.tableId = params.tableId;
  this.docType = params.docType;
  this.documentName = params.documentName;
  this.isActive = params.isActive;
  this.commentId = params.commentId;
};


CommonModal.prototype.postComment = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});
      
      let Query = `INSERT INTO comment_table(type, table_id, row_id, comment, is_active, created_by) VALUES(${that.commentType}, '${that.tableId}', ${that.rowId}, '${that.comment}', 1, ${that.created_by});`;
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
      
      let Query = `INSERT INTO document_table(type, table_id, row_id, document, is_active, created_by) 
                  VALUES (${that.docType}, '${that.tableId}', ${that.rowId}, '${that.documentName}', 1, ${that.created_by});`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}





CommonModal.prototype.getSingleComment = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});
      
      let Query = `SELECT * FROM comment_table  WHERE table_id = ${that.tableId} AND row_id = ${that.rowId} AND type = ${that.commentType} AND is_active = ${that.isActive} ORDER BY id DESC;`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}


CommonModal.prototype.handleActivationOfSingleComment = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
      
      connection.changeUser({database : dbName});
      
      let Query = `UPDATE comment_table  SET is_active = ${that.isActive} WHERE id = ${that.commentId} ;`;
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
