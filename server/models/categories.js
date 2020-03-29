const connection = require("../lib/connection.js");
const {dbName} = require("../lib/connection.js");

const Categories = function (params) {
  this.productId = params.productId;
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
};


Categories.prototype.getCategoryList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM categories WHERE is_active = 1 AND type = 1`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 

// Categories.prototype.getAllCategoryTableRecords = function () {
//   const that = this;
//   return new Promise(function (resolve, reject) {
//     connection.getConnection(function (error, connection) {
//       if (error) {
//         throw error;
//       }
//       connection.changeUser({database : dbName});
//       connection.query(`SELECT * FROM categories where is_active = 1`, function (error, rows, fields) {
//         if (error) {  console.log("Error...", error); reject(error);  }
//         resolve(rows);
//       });
//         connection.release();
//         console.log('Process Complete %d', connection.threadId);
//     });
//   });
// } 


Categories.prototype.getTotalProductList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      // let Query = 'SELECT p.id, p.main_category_id, p.middle_category_id, p.sub_category_id, p.product_name, p.model_no, p.price, p.description, p.brand_id, p.color_id, p.unit_id, p.is_active, p.status, brand.value as brand_name, color.value as color_name, unit.value as unit_name FROM `products` as p INNER JOIN static_records_value as brand ON brand.id = p.brand_id INNER JOIN static_records_value as color ON color.id = p.color_id INNER JOIN static_records_value as unit ON unit.id = p.unit_id WHERE p.is_active = 1';
      let Query = 'SELECT p.id, p.main_category_id, p.product_name, p.price, p.description, p.unit_id, p.is_active, p.status, unit.value as unit_name FROM `products` as p INNER JOIN static_records_value  as unit ON unit.id = p.unit_id WHERE p.is_active = 1';
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Categories.prototype.getMainCategoryList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM categories WHERE type = 1 AND parent_id = 0 AND is_active = 1`, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 



Categories.prototype.getMiddleCategoryList = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      connection.query(`SELECT * FROM categories WHERE type = 2 AND parent_id = ${that.mainCategoryId} AND is_active = 1`, function (error, rows, fields) {
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
      connection.query(`SELECT * FROM categories WHERE type = 3 AND parent_id = ${that.middleCategoryId} AND is_active = 1`, function (error, rows, fields) {
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
      // const VALUES = [that.mainCategoryId, that.middleCategoryId, that.subCategoryId, that.productName, that.brandId, that.colorId, that.modelNo, that.sellerId, that.imageId, that.price, that.unitId, that.description, 1, 1, that.createdBy];
      const VALUES = [that.mainCategoryId, 0, 0, that.productName, 0, 0, '', that.sellerId, 0, that.price, that.unitId, that.description, 1, 1, that.createdBy];
      
      let Query = `INSERT INTO products(main_category_id, middle_category_id, sub_category_id, product_name, brand_id, color_id, model_no, seller_id, image_id, price, unit_id, description, status, is_active, created_by) VALUES(?)`;
      connection.query(Query, [VALUES], function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
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
      // let Query = `SELECT p.id, p.main_category_id, p.middle_category_id, p.sub_category_id, p.product_name, p.model_no, p.price, p.description, p.brand_id, p.color_id, p.unit_id, p.is_active, p.status, brand.value as brand_name, color.value as color_name, unit.value as unit_name FROM products as p INNER JOIN static_records_value as brand ON brand.id = p.brand_id INNER JOIN static_records_value as color ON color.id = p.color_id INNER JOIN static_records_value as unit ON unit.id = p.unit_id WHERE p.is_active = 1 AND p.main_category_id = ${that.mainCategoryId}`;
      let Query = `SELECT p.id, p.main_category_id, p.product_name, p.price, p.description, p.unit_id, p.is_active, p.status, unit.value as unit_name FROM products as p INNER JOIN static_records_value  as unit ON unit.id = p.unit_id WHERE p.is_active = 1  AND p.main_category_id = ${that.mainCategoryId}`;

      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Categories.prototype.getProductUnderMiddleCategory = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = `SELECT p.id, p.main_category_id, p.middle_category_id, p.sub_category_id, p.product_name, p.model_no, p.price, p.description, p.brand_id, p.color_id, p.unit_id, p.is_active, p.status, brand.value as brand_name, color.value as color_name, unit.value as unit_name FROM products as p INNER JOIN static_records_value as brand ON brand.id = p.brand_id INNER JOIN static_records_value as color ON color.id = p.color_id INNER JOIN static_records_value as unit ON unit.id = p.unit_id WHERE p.is_active = 1 AND p.middle_category_id = ${that.middleCategoryId}`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
} 


Categories.prototype.getProductUnderSubCategory = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = `SELECT p.id, p.main_category_id, p.middle_category_id, p.sub_category_id, p.product_name, p.model_no, p.price, p.description, p.brand_id, p.color_id, p.unit_id, p.is_active, p.status, brand.value as brand_name, color.value as color_name, unit.value as unit_name FROM products as p INNER JOIN static_records_value as brand ON brand.id = p.brand_id INNER JOIN static_records_value as color ON color.id = p.color_id INNER JOIN static_records_value as unit ON unit.id = p.unit_id WHERE p.is_active = 1 AND p.sub_category_id = ${that.subCategoryId}`;
      connection.query(Query, function (error, rows, fields) {
        if (error) {  console.log("Error...", error); reject(error);  }
        resolve(rows);
      });
        connection.release();
        console.log('Process Complete %d', connection.threadId);
    });
  });
}



Categories.prototype.getSingleProduct = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.changeUser({database : dbName});
      let Query = `SELECT p.id, p.main_category_id, p.middle_category_id, p.sub_category_id, p.product_name, p.model_no, p.price, p.description, p.brand_id, p.color_id, p.unit_id, p.is_active, p.status, brand.value as brand_name, color.value as color_name, unit.value as unit_name FROM products as p INNER JOIN static_records_value as brand ON brand.id = p.brand_id INNER JOIN static_records_value as color ON color.id = p.color_id INNER JOIN static_records_value as unit ON unit.id = p.unit_id WHERE p.id = ${that.productId}`;
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
