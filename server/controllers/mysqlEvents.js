const MySQLEvents = require('@rodrigogs/mysql-events');
const mysqlEventScript = require('../lib/mysqlEvents.js');

const mysqlEventsController = async () => {
    const instance =    await mysqlEventScript.config();
                        await mysqlEventScript.start(instance);
                        // await mysqlEventScript.stop(instance);
                        await mysqlEventScript.addTrigger(instance, handleDbEvents);
                        // await mysqlEventScript.removeTrigger(instance);

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);    
}

const handleDbEvents = async (events) => {
    // console.log(events);
}

module.exports = {mysqlEventsScript: mysqlEventsController}