const Static = require('../models/static.js');

const getRequiredStaticRecordList = async function (req, res, next) {    
    try {
        const StaticModel = new Static({});
        const productUnitList = await StaticModel.getProductUnitList();
        const brandList = await StaticModel.getBrandList();
        const colorList = await StaticModel.getColorList();
        
        res.send({ 
            productUnitList: productUnitList,
            brandList : brandList,
            colorList : colorList,
        });
    } catch (err) {
        next(err);
    }
}



module.exports = {    
    getRequiredStaticRecordList : getRequiredStaticRecordList,    
};