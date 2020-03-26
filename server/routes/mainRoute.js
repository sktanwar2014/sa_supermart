const path = require('path');
const mainRoute = require('express').Router();
const { env } = require("../lib/database");


mainRoute.get('*', (req, res) => {
  if (env === 'dev' || env === 'uat' || env === 'prod') {
    const route = path.join(__dirname, '..', 'dist', 'index.html');
    res.sendFile(route);
  } else {
    const route = path.join(__dirname, '..', '..', 'src', 'index.html');
    res.sendFile(route);
  }
});

module.exports = mainRoute;
