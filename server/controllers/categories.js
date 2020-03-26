const Categories = require('../models/categories.js');

const getMainCategoryList = async function (req, res, next) {    
    try {
        const mainCategoriesList = await new Categories({}).getMainCategoryList();        
        res.send({ mainCategoriesList: mainCategoriesList});
    } catch (err) {
        next(err);
    }
}




module.exports = {    
    getMainCategoryList : getMainCategoryList
};