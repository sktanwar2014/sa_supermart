const express = require('express')
const Router = express.Router();
const Categories = require('../controllers/categories.js');


Router.route("/getAllCategoryTableRecords").get(Categories.getAllCategoryTableRecords);
Router.route("/getTotalProductList").get(Categories.getTotalProductList);

Router.route("/getMainCategoryList").get(Categories.getMainCategoryList);
Router.route("/getMiddleCategoryList").post(Categories.getMiddleCategoryList);
Router.route("/getSubCategoryList").post(Categories.getSubCategoryList);
Router.route("/insertNewProduct").post(Categories.insertNewProduct);

Router.route("/getProductUnderMainCategory").post(Categories.getProductUnderMainCategory);
Router.route("/getProductUnderMiddleCategory").post(Categories.getProductUnderMiddleCategory);
Router.route("/getProductUnderSubCategory").post(Categories.getProductUnderSubCategory);




module.exports = Router;