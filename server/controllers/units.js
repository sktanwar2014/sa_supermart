const Units = require('../models/units.js');

const setNewPacketUnit = async function (req, res, next) {
    const params = {
       unit_name : req.body.unit_name,
    }
    try {
        const newActivity = new Units(params);
        const result = await newActivity.setNewPacketUnit();
        if(result !== undefined && result !== null && result !== "" ){
            res.send( {isSuccessful : true} );
        }else{
            res.send( {isSuccessful : false} );
        }        
    } catch (err) {
        next(err);
    }
}


const setNewUnit = async function (req, res, next) {
    const params = {
       unit_name : req.body.unit_name,
       default_weight : req.body.default_weight,
    }
    try {
        const newActivity = new Units(params);
        const groupId = await newActivity.getLastGroupId();    
        if(groupId !== null && groupId != "null"){
            newActivity.group_id = groupId + 1;
        }else{
            newActivity.group_id = 1;
        }
        const result = await newActivity.setNewUnit();
        if(result !== undefined && result !== null && result !== "" ){
            res.send( {isSuccessful : true} );
        }else{
            res.send( {isSuccessful : false} );
        }        
    } catch (err) {
        next(err);
    }
}




module.exports = {    
    setNewPacketUnit : setNewPacketUnit,    
    setNewUnit : setNewUnit,
};