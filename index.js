require('dotenv').config();
const express = require('express');
const path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

const login = require('./paths/login.js');

const port = process.env.PORT || 2000;

var opts = {
    useNewUrlParser: true,
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
mongoose.connect(process.env.DB_URL, opts);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('exposed'));
app.set('views', './pages');
app.disable('x-powered-by');
app.use(cookieParser());
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/pages/home.html');
});
/*app.post('/post', function (reqq, ress) {
    var key = reqq.body.key;
    if (key != process.env.key) {
         ress.send("😛");
    }
   else{
     tweet();
    ress.sendFile(path.join(__dirname + '/done.html'));
   }
  });*/

  app.use(login);

app.use(function (req, res) {
    res.sendFile(__dirname + '/pages/404.html');
});
app.listen(port, () =>
    console.log(`Running on http://localhost:${port}`)
);