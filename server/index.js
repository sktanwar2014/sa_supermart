const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');

const { env } = require("./lib/database");
const {mysqlEvents} = require("./controllers/mysqlEvents.js");
var router = express.Router()


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb', extend: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true}));

app.use(cookieParser());
app.use(session({
  secret: 'abcdef',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60, // 60 min
    sameSite: true,
    secure: false
  }
}));



if (env === 'dev' || env === 'uat' || env === 'prod') {
    app.use('/', express.static(path.join(__dirname, 'dist')));
    app.use('/dist', express.static(path.join(__dirname, 'dist')));
} else {
    app.use('/', express.static(path.join(__dirname, '..', 'public')));
    app.use('/public', express.static(path.join(__dirname, '..', 'public')));
}

const mainRoute = require('./routes/mainRoute');

// app.use('*',mysqlEvents);

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


let port ='';

if(env === 'local'){
    port = 5000;
}else if(env === 'prod'){
    port = 3010;
}


const server = http.createServer(app);
server.listen(port, () => {
    console.log('server is running on port: ', port);    
});




const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
 
const program = async () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });
 
  const instance = new MySQLEvents(connection, {
    startAtEnd: true,    
  });
 
  await instance.start();
 
  instance.addTrigger({
    name: 'a1abiliti_sa_supermart',
    expression: 'a1abiliti_sa_supermart.*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (event) => { // You will receive the events here
      console.log(event);
    },
  });
  
  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};
 
program()
  .then(() => console.log('Waiting for database events...'))
  .catch(console.error);