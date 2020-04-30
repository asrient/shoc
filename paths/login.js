const express = require('express');
const Router = express.Router;
const common=require('../common.js');

let app=Router();
opts={};
app.get('/login',(req,res)=>{
    //res.render("login",opts);
    res.sendFile(common.baseDir + '/pages/login.html');
  })

module.exports=app;