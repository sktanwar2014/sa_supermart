const express = require('express')
const Router = express.Router();
const Categories = require('../controllers/categories.js');


Router.route("/getProductPacketInfo").post(Categories.getProductPacketInfo);
Router.route("/getCategoryList").get(Categories.getCategoryList);
Router.route("/getAllMainCategories").get(Categories.getAllMainCategories);
Router.route("/getAllSubCategories").post(Categories.getAllSubCategories);

Router.route("/getProductList").post(Categories.getProductList);
Router.route("/handleCategoryActivation").post(Categories.handleCategoryActivation);
Router.route("/handleSubCategoryActivation").post(Categories.handleSubCategoryActivation);


Router.route("/getSubCategoryList").post(Categories.getSubCategoryList);
Router.route("/insertNewProduct").post(Categories.insertNewProduct);

Router.route("/getProductUnderMainCategory").post(Categories.getProductUnderMainCategory);

Router.route("/addNewSubCategory").post(Categories.addNewSubCategory);
Router.route("/addNewCategory").post(Categories.addNewCategory);
Router.route("/updateSubCategory").post(Categories.updateSubCategory);
Router.route("/updateCategory").post(Categories.updateCategory);



module.exports = Router;