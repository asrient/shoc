const express = require('express');
const Router = express.Router;
const common = require('../common.js');

let app = Router();

app.get('/_logout', (req, res) => {
  res.clearCookie('ticket');
      res.redirect('/');
})

module.exports = app;