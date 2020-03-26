const env = 'local';

let DbName = 'shopping';
let domainName = 'localhost:5000';

console.log('env...', env);

if (env === 'prod') {
  DbName = 'shopping';
  domainName = '';
} else {  
  DbName = 'shopping'
  domainName = 'localhost:5000'
}

module.exports = { dbName: DbName, domainName: domainName, env: env };