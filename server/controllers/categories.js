const Categories = require('../models/categories.js');
const {isEmpty} = require('../utils/conditionChecker.js');

const getCategoryList = async function (req, res, next) {    
    try {
        const categoryList = await new Categories({}).getCategoryList();        
        res.send({ categoryList: categoryList});
    } catch (err) {
        next(err);
    }
}



const getAllMainCategories = async function (req, res, next) {    
    try {
        const categoryList = await new Categories({}).getAllMainCategories();        
        res.send({ categoryList: categoryList});
    } catch (err) {
        next(err);
    }
}




const getAllSubCategories = async function (req, res, next) {
    const params = {
        categoryId: req.body.categoryId,
    }
    try {
        const activity = new Categories(params);
        const subCategoriesList = await activity.getAllSubCategories();  
        res.send({ subCategoriesList: subCategoriesList});      
    } catch (err) {
        next(err);
    }
}




const handleCategoryActivation = async function (req, res, next) {    
    const params = {
        categoryId: req.body.categoryId,
        isActive : Number(req.body.is_active) === 1 ? 0 : 1,
    }
    try {
        const activity = new Categories(params);
        await activity.handleCategoryActivation();        

        const categoryList = await activity.getAllMainCategories();         
        res.send({ categoryList: categoryList});
    } catch (err) {
        next(err);
    }
}



const handleSubCategoryActivation = async function (req, res, next) {    
    const params = {
        categoryId: req.body.categoryId,
        subCategoryId: req.body.subCategoryId,
        isActive : Number(req.body.is_active) === 1 ? 0 : 1,
    }
    try {
        const activity = new Categories(params);
        await activity.handleSubCategoryActivation();        
        
        const subCategoriesList = await activity.getAllSubCategories();  
        res.send({ subCategoriesList: subCategoriesList});   
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
        get: req.body.get,
    };
    try {
        const activity  = new Categories(params);
        const insertId = await activity.addNewCategory();
       
        if(params.get ===  'activated'){
            const categoryList = await activity.getCategoryList();        
            res.send({ categoryList: categoryList, newCategoryId : insertId});
        }else{
            const categoryList = await activity.getAllMainCategories();         
            res.send({ categoryList: categoryList});
        }
        
    } catch (err) {
        next(err);
    }
}



const updateCategory = async function (req, res, next) {
    const params = {
        categoryId : req.body.categoryId,
        category_name : req.body.category_name,
    };
    try {
        const activity = new Categories(params);
        const result = await activity.updateCategory();
        
        const categoryList = await activity.getAllMainCategories();         
        res.send({ categoryList: categoryList});
    } catch (err) {
        next(err);
    }
}

const addNewSubCategory = async function (req, res, next) {
    const params = {
        get : req.body.get,
        categoryId : req.body.categoryId,
        category_name : req.body.category_name,
    };
    try {
        const activity = new Categories(params);
        const insertId = await activity.addNewSubCategory();
        
        if(params.get ===  'activated'){
            const subCategoriesList = await activity.getSubCategoryList();
            res.send({ subCategoriesList: subCategoriesList, newSubCategoryId : insertId});
        }else{
            const subCategoriesList = await activity.getAllSubCategories();  
            res.send({ subCategoriesList: subCategoriesList}); 
        }
        
    } catch (err) {
        next(err);
    }
}




const updateSubCategory = async function (req, res, next) {
    const params = {
        subCategoryId : req.body.subCategoryId,
        category_name : req.body.category_name,
        categoryId : req.body.categoryId,
    };
    try {
        const activity = new Categories(params);
        const result = await activity.updateSubCategory();
        
        const subCategoriesList = await activity.getAllSubCategories();  
        res.send({ subCategoriesList: subCategoriesList});      
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
    getCategoryList: getCategoryList,
    getAllMainCategories : getAllMainCategories,
    getAllSubCategories: getAllSubCategories,
    handleCategoryActivation: handleCategoryActivation,
    handleSubCategoryActivation: handleSubCategoryActivation,
    getProductList : getProductList,
    getSubCategoryList : getSubCategoryList,
    insertNewProduct : insertNewProduct,

    getProductUnderMainCategory : getProductUnderMainCategory,
    
    addNewCategory : addNewCategory,
    addNewSubCategory : addNewSubCategory,
    updateSubCategory: updateSubCategory,
    updateCategory: updateCategory,
    getProductPacketInfo : getProductPacketInfo,
};