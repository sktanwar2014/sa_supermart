const env = 'prod';

let DbName = 'a1abil_safresh';
let domainName = 'safresh.a1abilities.com.au';
let mailPass = 'Pr4m$5ASOU$t';
let mailUser = 'admin@safresh.a1abilities.com.au';
let mailService = 'safresh.a1abilities.co.nz';



console.log('env...', env);

if (env === 'prod') {
  DbName = 'a1abil_safresh';
  domainName = 'safresh.a1abilities.com.au';
  mailPass = 'Pr4m$5ASOU$t';
  mailUser = 'admin@safresh.a1abilities.com.au';
  mailService = 'safresh.a1abilities.co.nz';
}else if(env === 'dev'){
  DbName = 'a1abiliti_shopping';
  domainName = 'ordernow.a1abilities.co.nz';
  mailPass = 'q!G#19weS';
  mailUser = 'admin@ordernow.a1abilities.co.nz';
  mailService = 'ordernow.a1abilities.co.nz';
} else {  
  DbName = 'a1abiliti_sa_supermart'
  domainName = 'localhost:5000'
}

module.exports = { dbName: DbName, domainName: domainName, mailPass: mailPass, mailUser: mailUser, mailService: mailService, env: env };
