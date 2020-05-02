const express = require('express');
const Router = express.Router;
const common = require('../common.js');

let app = Router();

app.get('/account', (req, res) => {
  if (res.enroll != null) {
    res.render('account', { enroll: res.enroll, name: res.name })
  }
  else
    res.redirect('/login');
})

module.exports = app;