const env = 'local';

let DbName = 'a1abiliti_shopping';
let domainName = 'ordernow.a1abilities.co.nz';
let mailPass = 'q!G#19weS';
let mailUser = 'admin@ordernow.a1abilities.co.nz';
let mailService = 'ordernow.a1abilities.co.nz';



console.log('env...', env);

if (env === 'prod') {
  DbName = 'a1abiliti_shopping';
  domainName = 'ordernow.a1abilities.co.nz';
} else {  
  DbName = 'a1abiliti_sa_supermart'
  domainName = 'localhost:5000'
}

module.exports = { dbName: DbName, domainName: domainName, mailPass: mailPass, mailUser: mailUser, mailService: mailService, env: env };
