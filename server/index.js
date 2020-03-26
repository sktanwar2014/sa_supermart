const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

const { env } = require("./lib/database");

if (env === 'dev' || env === 'uat' || env === 'prod') {
    app.use('/', express.static(path.join(__dirname, 'dist')));
    app.use('/dist', express.static(path.join(__dirname, 'dist')));
} else {
    app.use('/', express.static(path.join(__dirname, '..', 'src')));
    app.use('/src', express.static(path.join(__dirname, '..', 'src')));
}

const mainRoute = require('./routes/mainRoute');

app.use('/categories', require('./routes/categories'));
app.use('/auth', require('./routes/auth'));
app.use('/',mainRoute);

let port ='';

if(env === 'local'){
    port = 5000;
}else if(env === 'prod'){
    port = 3020;
}


const server = http.createServer(app);
server.listen(port, () => {
    console.log('server is running on port: ', port);    
});