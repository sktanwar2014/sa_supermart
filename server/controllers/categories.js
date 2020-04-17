const Categories = require('../models/categories.js');
const {isEmpty} = require('../utils/conditionChecker.js');

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


const getProductList = async function (req, res, next) {    
    const params = {
        categoryId : Number(req.body.categoryId),
        subCategoryId : Number(req.body.subCategoryId),
    }
    try {
        const defModal = new Categories(params);
        const productList = await defModal.getProductList();
        res.send({ productList: productList});
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
        categoryId : req.body.categoryId,
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
        categoryId : Number(req.body.categoryId),
        subCategoryId : Number(req.body.subCategoryId),
        productName : req.body.productName,
        description : req.body.description,
        createdBy : Number(req.body.createdBy),
        productUnits : req.body.productUnits,
        mainUnitId : Number(req.body.mainUnitId),
    };
    try {
        const defineModal = new Categories(params);
        const productInsertId = await defineModal.insertNewProduct();
        defineModal.productId = productInsertId;
                
        if(params.productUnits.length > 0){
            const unitsInsertId = await defineModal.insertProductUnits();
        }

        if(isEmpty(productInsertId)){
            res.send(true);
        }else{
            res.send(false);
        }
        
    } catch (err) {
        next(err);
    }
}




const addNewCategory = async function (req, res, next) {
    const params = {
        category_name : req.body.category_name,
    };
    try {
        const insertId = await new Categories(params).addNewCategory();
        const categoryList = await new Categories({}).getCategoryList();        
        res.send({ categoryList: categoryList, newCategoryId : insertId});
    } catch (err) {
        next(err);
    }
}



const addNewSubCategory = async function (req, res, next) {
    const params = {
        categoryId : req.body.categoryId,
        category_name : req.body.category_name,
    };
    try {
        const insertId = await new Categories(params).addNewSubCategory();
        const subCategoriesList = await new Categories(params).getSubCategoryList();
        res.send({ subCategoriesList: subCategoriesList, newSubCategoryId : insertId});
    } catch (err) {
        next(err);
    }
}



const getProductPacketInfo = async function (req, res, next) {
    const params = {
        productId : req.body.productId,
        unitId : req.body.unitId,
    };
    try {
        const result = await new Categories(params).getProductPacketInfo();
        res.send({ productPacketInfo: result });
    } catch (err) {
        next(err);
    }
}



module.exports = {    
    // getAllCategoryTableRecords : getAllCategoryTableRecords,
    getCategoryList: getCategoryList,
    getProductList : getProductList,
    getMainCategoryList : getMainCategoryList,
    getMiddleCategoryList : getMiddleCategoryList,
    getSubCategoryList : getSubCategoryList,
    insertNewProduct : insertNewProduct,

    getProductUnderMainCategory : getProductUnderMainCategory,
    
    addNewCategory : addNewCategory,
    addNewSubCategory : addNewSubCategory,
    getProductPacketInfo : getProductPacketInfo,
};