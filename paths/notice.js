const express = require('express');
const fs = require('fs');
const Router = express.Router;
const common = require('../common.js');

let app = Router();

app.get('/notice', (req, res) => {
  const data=JSON.parse(fs.readFileSync('./notices.json'));
    res.render('notice',{data});
})

module.exports = app;