const Settings = require('../models/settings.js');

const getSettings = async function (req, res, next) {
    const params = {
       type : req.body.type,
       userId : req.decoded.id,
    }
    // console.log(params)
    try {
        const newActivity = new Settings(params);
        const result = await newActivity.getSettings();
        res.send( {settingList: result} );
    } catch (err) {
        next(err);
    }
}


const updateAutomationSettings = async function (req, res, next) {
    const params = {
        settingList : req.body.settingList,
        type : req.body.type,
        userId : req.decoded.id,
    }
    // console.log(params)
    try {
        const newActivity = new Settings(params);
        await newActivity.updateAutomationSettings();

        const result = await newActivity.getSettings();
        res.send({settingList: result});
    } catch (err) {
        next(err);
    }
}


module.exports = {    
    getSettings : getSettings,   
    updateAutomationSettings: updateAutomationSettings, 
};