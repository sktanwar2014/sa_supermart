const Categories = require('../models/categories.js');

// const getAllCategoryTableRecords = async function (req, res, next) {    
//     try {
//         const allCategoryTableRecords = await new Categories({}).getAllCategoryTableRecords();        
//         res.send({ allCategoryTableRecords: allCategoryTableRecords});
//     } catch (err) {
//         next(err);
//     }
// }

const getCategoryList = async function (req, res, next) {    
    try {
        const categoryList = await new Categories({}).getCategoryList();        
        res.send({ categoryList: categoryList});
    } catch (err) {
        next(err);
    }
}


const getTotalProductList = async function (req, res, next) {    
    try {
        const totalProductList = await new Categories({}).getTotalProductList();
        res.send({ totalProductList: totalProductList});
    } catch (err) {
        next(err);
    }
}



const getProductUnderMainCategory = async function (req, res, next) {
    const params = {
        mainCategoryId : req.body.mainCategoryId,
    };
    try {
        const productList = await new Categories(params).getProductUnderMainCategory();        
        res.send({ productList: productList});
    } catch (err) {
        next(err);
    }
}

const getProductUnderMiddleCategory = async function (req, res, next) {
    const params = {
        middleCategoryId : req.body.middleCategoryId,
    };
    try {
        const totalProductList = await new Categories(params).getProductUnderMiddleCategory();        
        res.send({ totalProductList: totalProductList});
    } catch (err) {
        next(err);
    }
}

const getProductUnderSubCategory = async function (req, res, next) {
    const params = {
        subCategoryId : req.body.subCategoryId,
    };
    try {
        const totalProductList = await new Categories(params).getProductUnderSubCategory();        
        res.send({ totalProductList: totalProductList});
    } catch (err) {
        next(err);
    }
}



const getMainCategoryList = async function (req, res, next) {
    try {
        const mainCategoriesList = await new Categories({}).getMainCategoryList();        
        res.send({ mainCategoriesList: mainCategoriesList});
    } catch (err) {
        next(err);
    }
}



const getMiddleCategoryList = async function (req, res, next) {
    const params = {
        mainCategoryId : req.body.mainCategoryId,
    };
    try {
        const middleCategoriesList = await new Categories(params).getMiddleCategoryList();        
        res.send({ middleCategoriesList: middleCategoriesList});
    } catch (err) {
        next(err);
    }
}


const getSubCategoryList = async function (req, res, next) {
    const params = {
        middleCategoryId : req.body.middleCategoryId,
    };
    try {
        const subCategoriesList = await new Categories(params).getSubCategoryList();
        res.send({ subCategoriesList: subCategoriesList});
    } catch (err) {
        next(err);
    }
}


const insertNewProduct = async function (req, res, next) {
    const params = {
        mainCategoryId : Number(req.body.mainCategoryId),
        // middleCategoryId : Number(req.body.middleCategoryId),
        // subCategoryId : Number(req.body.subCategoryId),
        productName : req.body.productName,
        // brandId : Number(req.body.brandId),
        // colorId : Number(req.body.colorId),
        // modelNo : req.body.modelNo,
        sellerId : Number(req.body.sellerId),
        // imageId : Number(req.body.imageId),
        price : Number(req.body.price),
        unitId : Number(req.body.unitId),
        description : req.body.description,
        createdBy : Number(req.body.createdBy),
    };
    try {
        const result = await new Categories(params).insertNewProduct();
        if(result !== "" && result !== undefined && result !== null && result.insertId > 0){
            res.send(true);
        }else{
            res.send(false);
        }
        
    } catch (err) {
        next(err);
    }
}


module.exports = {    
    // getAllCategoryTableRecords : getAllCategoryTableRecords,
    getCategoryList: getCategoryList,
    getTotalProductList : getTotalProductList,
    getMainCategoryList : getMainCategoryList,
    getMiddleCategoryList : getMiddleCategoryList,
    getSubCategoryList : getSubCategoryList,
    insertNewProduct : insertNewProduct,

    getProductUnderMainCategory : getProductUnderMainCategory,
    getProductUnderMiddleCategory : getProductUnderMiddleCategory,
    getProductUnderSubCategory : getProductUnderSubCategory ,
    
};