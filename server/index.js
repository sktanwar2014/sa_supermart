const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const { env } = require("./lib/database.js");
const { nodePort } = require("./lib/connection.js");
const {mysqlEventsScript} = require("./controllers/mysqlEvents.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb', extend: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true}));




if (env === 'dev' || env === 'uat' || env === 'prod') {
    app.use('/', express.static(path.join(__dirname, 'dist')));
    app.use('/dist', express.static(path.join(__dirname, 'dist')));
} else {
    app.use('/', express.static(path.join(__dirname, '..', 'public')));
    app.use('/public', express.static(path.join(__dirname, '..', 'public')));
}

const mainRoute = require('./routes/mainRoute');

app.use('/staticrecords', require('./routes/static'));
app.use('/categories', require('./routes/categories'));
app.use('/auth', require('./routes/auth'));
app.use('/cart', require('./routes/cart'));
app.use('/order', require('./routes/order'));
app.use('/units', require('./routes/units'));
app.use('/settings', require('./routes/settings'));



app.use('/api/images', function (req, res, next) {
  try {
    const fileName = (req.query.path).toString().split('/').pop();
    let file = '';

    try {
      if(fileName === 'null'){
          file = `${__dirname}/files/fileNotAvailabe.jpg`;
      }else if (fs.existsSync(`${__dirname}/files/${req.query.path}`)) {
          file = `${__dirname}/files/${req.query.path}`;
      }else {
          file = `${__dirname}/files/fileNotAvailabe.jpg`;
      }
    } catch(err) {
      console.error(err)
    }

    res.download(file); // Set disposition and send it.
  } catch (error) {
    next(error);
  }
});


app.use('/',mainRoute);


const server = http.createServer(app);
server.listen(nodePort, async () => {
    console.log('server is running on port: ', nodePort);
    await mysqlEventsScript();
});