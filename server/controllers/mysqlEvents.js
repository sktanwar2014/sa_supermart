const {mysqlEvents} = require('../lib/mysqlEvents.js');

const callEvents = async (req, res) => {
    console.log('req.body', req.body);

    // const instance = await mysqlEvents();
    // await instance.start();
    // await instance.stop();
    // console.log(instance);
    // mysqlEvents((event) =>  {
        
    //     console.log(event)
    // }).then((instance) => {        
    //     // console.log(instance)
    //         instance.stop().then(
    //         () => console.log('mysqlEvents has been stopped.')
    //       ).catch(err => console.error('mysqlEvents.stop() Error...', err));
    //         console.log('Waiting for database events...')
            res.send({});
    // }).catch('mysqlEvents Error...', console.error);
}

module.exports = {mysqlEvents: callEvents}