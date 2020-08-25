const MySQLEvents = require('@rodrigogs/mysql-events');
const {connectionPool, dbOptions} = require('./connection.js');
const { env, dbName } = require("./database");


const mysqlEvents = async () => {
  console.log('Enter in mysqlEvents method*******');
  const options = {
    startAtEnd: true,
    // serverId: 1,	            // integer	//  Default: 1  // Unique number (1 - 232) to identify this replication slave instance. Must be specified if running more than one instance of ZongJi. Must be used in start() method for effect.
    // startAtEnd: true,         //  boolean //  Default: false  // 	Pass true to only emit binlog events that occur after ZongJi's instantiation. Must be used in start() method for effect.
    // binlogName:	'',           //  string	//    Begin reading events from this binlog file. If specified together with binlogNextPos, will take precedence over startAtEnd.
    // binlogNextPos: 1000,	    //  integer	//  Begin reading events from this position. Must be included with binlogName.
    // includeEvents: ['writerows', 'updaterows', 'deleterows'],
    //                           //	Array of event names to include, Example: ['writerows', 'updaterows', 'deleterows']
    // excludeEvents: ['rotate', 'tablemap'],   //	Array of event names to exclude. Example: ['rotate', 'tablemap']
    // includeSchema: {},        //	object	//  Object describing which databases and tables to include (Only for row events). Use database names as the key and pass an array of table names or true (for the entire database).
    //                           //  Example: { 'my_database': ['allow_table', 'another_table'], 'another_db': true }
    // excludeSchema: {},  	    //  object	//  Object describing which databases and tables to exclude (Same format as includeSchema)
                              //  Example: { 'other_db': ['disallowed_table'], 'ex_db': true }
  };

  const instance = new MySQLEvents(dbOptions, options);
  
  // await instance.stop().then(
  //   () => console.log('mysqlEvents has been stopped.')
  // ).catch(err => console.error('mysqlEvents.stop() Error...', err));

  // instance.addTrigger({
  //   name: 'dbMonitoring',
  //   expression: `${dbName}.*`,
  //   statement: MySQLEvents.STATEMENTS.ALL,
  //   onEvent: async (event) => { // You will receive the events here
  //     console.log(event);
  //     // await callback(event); 
  //     // instance.stop().then(
  //     //   () => console.log('mysqlEvents has been stopped.')
  //     // ).catch(err => console.error('mysqlEvents.stop() Error...', err));
  //   },
  // });

  // instance.removeTrigger({
  //   name: 'dbMonitoring',
  //   expression: `${dbName}.*`,
  //   statement: MySQLEvents.STATEMENTS.ALL,
  // });
  
  // await instance.start().then(
  //   () => console.log('mysqlEvents Started.')
  // ).catch(err => console.error('Something bad happened', err));
  
  
  // instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  // instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);  

  return instance;
};

module.exports = {  mysqlEvents };