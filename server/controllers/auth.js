const Auth = require('../models/auth.js');

const login = async function (req, res, next) {
    const params = {
        user_id: req.body.username,
       password: req.body.password,
    }
    try {
        const newActivity = new Auth(params);
        const result = await newActivity.login();
        res.send( result );
    } catch (err) {
        next(err);
    }
}



const getUserList = async function (req, res, next) {
    try {
        const result = await new Auth({}).getUserList();
        res.send( {userList: result} );
    } catch (err) {
        next(err);
    }
}


module.exports = {    
    login : login,
    getUserList : getUserList,
};