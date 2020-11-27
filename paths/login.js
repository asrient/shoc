const express = require('express');
const Router = express.Router;
const common = require('../common.js');

let app = Router();

app.get('/login', (req, res) => {
  if (res.enroll != null) {
    if (req.query.next != undefined)
      res.redirect(req.query.next);
    else
      res.redirect('/account');
  }
  else{
    res.render('login',{next:req.query.next});
  }
})

module.exports = app;