const express = require('express');
const Router = express.Router;
const common = require('../common.js');

let app = Router();

app.get('/login', (req, res) => {
  //res.render("login",opts);
  console.log(res.enroll);
  if (res.enroll != null) {
    if (req.query.next != undefined)
      res.redirect(req.query.next);
    else
      res.redirect('/account');
  }
  else
    res.sendFile(common.baseDir + '/pages/login.html');
})

module.exports = app;