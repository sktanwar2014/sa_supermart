const Categories = require('../models/categories.js');
const {isNotEmpty} = require('../utils/conditionChecker.js');
const {uploadDocument} = require('../utils/uploadDocument.js');

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
        pageNo : Number(req.body.pageNo),
        isActive : Number(req.body.is_active),
    }
    try {
        const defModal = new Categories(params);
        const productList = await defModal.getProductList();
        const productListCount = await defModal.getProductListCount();
        
        res.send({ productList: productList, productListCount: productListCount.length});
    } catch (err) {
        next(err);
    }
}



const handleArchiveProduct = async function (req, res, next) {    
    const params = {
        productId : Number(req.body.productId),
        isActive : Number(req.body.is_active) === 1 ? 0 : 1,
    }
    try {
        const defModal = new Categories(params);
        const result = await defModal.handleArchiveProduct();
        
        res.send(result);
    } catch (err) {
        next(err);
    }
}



const getSingleProductData = async function (req, res, next) {    
    const params = {
        productId : req.body.productId,
    }
    try {
        const defModal = new Categories(params);
        const productData = await defModal.getSingleProductData();
        const units = await defModal.unitsOfProduct();
        const images = await defModal.imagesOfProduct();
        res.send({ productData: productData, units : units, images: images});
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





const updateProduct = async function (req, res, next) {
    // console.log(req.body);
    const params = {
        productId : req.body.productId,
        productName : req.body.productName,
        description : req.body.description,
        productUnits : req.body.productUnits,
        imageId : req.body.imageId,
        picType : req.body.picType,
        documentName : '',
    };
    try {
        const defineModal = new Categories(params);

        if(params.picType === 1 && params.document !== ""){
            const base64Data = req.body.document.data.split(';base64,').pop();
            let name = req.body.document.name.split('.')[0] + "_" + Date.now() + '.' + req.body.document.name.split('.')[1];
        
            await uploadDocument(`./files/productImages/${name}`, base64Data).catch(error => {
                console.error(error);
                throw (error);
            });
            defineModal.documentName = name;
            await defineModal.uploadProductImage();
        }else if(params.picType === 2 && params.imageId !== 0){
            await defineModal.changeProductImage();
        }
    
        if(params.productUnits.length > 0){
            await defineModal.updateProductUnits();
        }
        
        const result = await defineModal.updateProduct();
        res.send(isNotEmpty(result));
    } catch (err) {
        next(err);
    }
}




const insertNewProduct = async function (req, res, next) {
    // console.log(req.body);
    const base64Data = req.body.document.data.split(';base64,').pop();
    const name = req.body.document.name.split('.')[0] + "_" + Date.now() + '.' + req.body.document.name.split('.')[1];

    await uploadDocument(`./files/productImages/${name}`, base64Data).catch(error => {
        console.error(error);
        throw (error);
    });

    const params = {
        categoryId : Number(req.body.categoryId),
        subCategoryId : Number(req.body.subCategoryId),
        productName : req.body.productName,
        description : req.body.description,
        createdBy : Number(req.body.createdBy),
        productUnits : req.body.productUnits,
        mainUnitId : Number(req.body.mainUnitId),
        documentName : name,
    };

    try {
        const defineModal = new Categories(params);
        const productInsertId = await defineModal.insertNewProduct();
        defineModal.productId = productInsertId;
        
        await defineModal.uploadProductImage();

        if(params.productUnits.length > 0){
            const unitsInsertId = await defineModal.insertProductUnits();
        }
        res.send(isNotEmpty(productInsertId));
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
    handleArchiveProduct: handleArchiveProduct,
    getSingleProductData : getSingleProductData,
    getSubCategoryList : getSubCategoryList,
    insertNewProduct : insertNewProduct,
    updateProduct : updateProduct,

    getProductUnderMainCategory : getProductUnderMainCategory,
    
    addNewCategory : addNewCategory,
    addNewSubCategory : addNewSubCategory,
    updateSubCategory: updateSubCategory,
    updateCategory: updateCategory,
    getProductPacketInfo : getProductPacketInfo,
};