const express = require('express')
const Router = express.Router();
const Categories = require('../controllers/categories.js');


Router.route("/getMainCategoryList").get(Categories.getMainCategoryList);



module.exports = Router;