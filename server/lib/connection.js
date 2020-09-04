const MySQL = require("mysql");

const { env, dbName } = require("./database");

let dbOptions = '';
let nodePort = 3001;


if (env === 'prod') {
   dbOptions = {
      host: 'localhost',
      user: 'a1abil_safresh',
      password:'K9$X~hgxez;U',
      port: 3306
   };
   nodePort = 3001;
}else if(env === 'dev'){
   dbOptions = {
      host: 'localhost',
      user: 'root',
      password:'ekLZGG7L2bUYvpBv',
      port: 3306
   };
   nodePort = 3010;
} else {
   dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
   };
   nodePort = 5000;
}

let connectionPool = MySQL.createPool({ host: dbOptions.host, user: dbOptions.user, password: dbOptions.password, port: dbOptions.port, database: dbName });
const getConnection = async function (done) {
   try {
      connectionPool.getConnection(done);
   } catch (ex) {
      console.log("ex........", ex);
      throw ex;
   }
};
module.exports = { 
   dbOptions: dbOptions,
   getConnection: getConnection, 
   dbName: dbName,
   nodePort : nodePort,
};