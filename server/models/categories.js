const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const Categories = function (params) {
  this.productId = params.productId;
  this.categoryId = params.categoryId;
  this.mainCategoryId = params.mainCategoryId;
  this.middleCategoryId = params.middleCategoryId;
  this.subCategoryId = params.subCategoryId;
  this.productName = params.productName;
  this.brandId = params.brandId;
  this.colorId = params.colorId;
  this.modelNo = params.modelNo;
  this.sellerId = params.sellerId;
  this.imageId = params.imageId;
  this.price = params.price;
  this.unitId = params.unitId;
  this.description = params.description;  
  this.createdBy = params.createdBy;
  this.category_name = params.category_name;
  this.productUnits = params.productUnits;
  this.mainUnitId = params.mainUnitId;
  this.isActive = params.isActive;
};


Categories.prototype.getCategoryList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM categories WHERE is_active = 1 AND type = 1 ORDER BY category_name`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Categories.prototype.getAllMainCategories = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM categories WHERE type = 1 ORDER BY category_name`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Categories.prototype.handleCategoryActivation = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`UPDATE categories SET is_active = ${that.isActive} WHERE id = ${that.categoryId}`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Categories.prototype.handleSubCategoryActivation = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`UPDATE categories SET is_active = ${that.isActive} WHERE id = ${that.subCategoryId}`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Categories.prototype.getProductList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});         
      // let Query = `SELECT p.id, p.category_id, p.sub_category_id, p.product_name, p.main_unit_id, p.description, p.is_active, p.status, p.created_at FROM products as p WHERE p.is_active = 1 `;
      let Query = `SELECT p.id, p.category_id, p.sub_category_id, p.product_name, p.main_unit_id, p.description, p.is_active, p.status, p.created_at, GROUP_CONCAT(pm.id) AS unit_table_id, GROUP_CONCAT(pm.unit_value) AS unit_value, GROUP_CONCAT(pm.unit_id) AS unit_id, GROUP_CONCAT(pm.price) AS price, GROUP_CONCAT(pm.packet_weight) AS packet_weight, GROUP_CONCAT(pm.is_packet) AS is_packet, GROUP_CONCAT(pm.packet_unit_id) AS packet_unit_id FROM products as p INNER JOIN products_measurement as pm ON pm.product_id =  p.id WHERE p.is_active = 1 `;
      if(that.categoryId !== 0){
        Query = Query + ` AND p.category_id = ${that.categoryId} `;
      }
      if(that.subCategoryId !== 0){
        Query = Query + ` AND p.sub_category_id = ${that.subCategoryId} `;
      }
      Query = Query + ` GROUP BY p.id ORDER BY product_name`;

      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Categories.prototype.getSubCategoryList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM categories WHERE type = 2 AND parent_id = ${that.categoryId} AND is_active = 1 ORDER BY category_name` , function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Categories.prototype.getAllSubCategories = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM categories WHERE type = 2 AND parent_id = ${that.categoryId} ORDER BY category_name` , function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Categories.prototype.insertNewProduct = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      const VALUES = [that.categoryId, that.subCategoryId, that.productName, that.mainUnitId, 0,that.description, 1, 1, that.createdBy];
      
      let Query = `INSERT INTO products(category_id, sub_category_id, product_name, main_unit_id, image_id, description, status, is_active, created_by) VALUES(?)`;
      connection.query(Query, [VALUES], function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows.insertId);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 




Categories.prototype.insertProductUnits = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});

      (that.productUnits.length > 0 ? that.productUnits : []).map((data, index) => {
        let Values = [that.productId, data.unitValue, data.unitIn, data.price,  data.isPacket,  data.packetWeight, data.packetUnitId, 1];
        let Query = `INSERT INTO products_measurement(product_id, unit_value, unit_id, price, is_packet, packet_weight, packet_unit_id, is_active) VALUES(?)`;
        connection.query(Query, [Values], function (error, rows, fields) {
          if (error) {  console.log("Error...", error); reject(error);}
            resolve(rows.insertId);
        });
      })
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 

Categories.prototype.getProductUnderMainCategory = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = `SELECT p.id, p.main_category_id, p.product_name, p.price, p.description, p.unit_id, p.is_active, p.status, unit.value as unit_name FROM products as p INNER JOIN unit_records  as unit ON unit.id = p.unit_id WHERE p.is_active = 1  AND p.main_category_id = ${that.mainCategoryId} ORDER BY category_name`;

      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Categories.prototype.addNewCategory = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = `INSERT INTO categories(type, category_name, parent_id, status, is_active, created_by) VALUES (?)`;
      let Values = [1,  that.category_name, 0, 1, 1, 1];
      connection.query(Query, [Values], function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows.insertId);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}





Categories.prototype.updateCategory = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {     throw error;      }
      connection.changeUser({database : dbName});

      connection.query(`UPDATE categories SET category_name = '${that.category_name}' WHERE id = ${that.categoryId}`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}




Categories.prototype.updateSubCategory = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {     throw error;      }
      connection.changeUser({database : dbName});

      connection.query(`UPDATE categories SET category_name = '${that.category_name}' WHERE id = ${that.subCategoryId}`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}



Categories.prototype.addNewSubCategory = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = `INSERT INTO categories(type, category_name, parent_id, status, is_active, created_by) VALUES (?)`;
      let Values = [2,  that.category_name, that.categoryId, 1, 1, 1];
      connection.query(Query, [Values], function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows.insertId);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}





Categories.prototype.getProductPacketInfo = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = `SELECT pm.id, pm.product_id, pm.unit_value, pm.unit_id, unit.unit_name, pm.price,  pm.is_packet, pm.packet_weight, pm.packet_unit_id, unit2.unit_name as packet_unit_name, pm.is_active FROM products_measurement as pm INNER JOIN unit_records as unit ON pm.unit_id = unit.id LEFT JOIN unit_records as unit2 ON unit2.id = pm.packet_unit_id WHERE product_id = ${that.productId} AND unit_id  = ${that.unitId}`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}



module.exports = Categories;
