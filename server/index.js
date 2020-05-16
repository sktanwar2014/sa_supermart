const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');


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


const { env } = require("./lib/database");

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



app.use('/api/images', function (req, res, next) {
  try {
    const fileName = (req.query.path).toString().split('/').pop();

    let file = '';

    if(fileName === 'null'){
        file = `${__dirname}/files/fileNotAvailabe.jpg`;
    }else{
        file = `${__dirname}/files/${req.query.path}`;
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