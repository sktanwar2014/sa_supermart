const express = require('express')
const Router = express.Router();
const Categories = require('../controllers/categories.js');

const validateToken = require('../utils/utils.js').validateToken;

Router.route("/getProductPacketInfo").post(validateToken, Categories.getProductPacketInfo);
Router.route("/getCategoryList").get(validateToken, Categories.getCategoryList);
Router.route("/getAllMainCategories").get(validateToken, Categories.getAllMainCategories);
Router.route("/getAllSubCategories").post(validateToken, Categories.getAllSubCategories);

Router.route("/getProductList").post(validateToken, Categories.getProductList);
Router.route("/getSingleProductData").post(validateToken, Categories.getSingleProductData);
Router.route("/handleCategoryActivation").post(validateToken, Categories.handleCategoryActivation);
Router.route("/handleSubCategoryActivation").post(validateToken, Categories.handleSubCategoryActivation);


Router.route("/getSubCategoryList").post(validateToken, Categories.getSubCategoryList);
Router.route("/insertNewProduct").post(validateToken, Categories.insertNewProduct);
Router.route("/updateProduct").post(validateToken, Categories.updateProduct);

Router.route("/getProductUnderMainCategory").post(validateToken, Categories.getProductUnderMainCategory);

Router.route("/addNewSubCategory").post(validateToken, Categories.addNewSubCategory);
Router.route("/addNewCategory").post(validateToken, Categories.addNewCategory);
Router.route("/updateSubCategory").post(validateToken, Categories.updateSubCategory);
Router.route("/updateCategory").post(validateToken, Categories.updateCategory);



module.exports = Router;