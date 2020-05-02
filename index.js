require('dotenv').config();
const express = require('express');
const path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

const common = require('./common.js');
const login = require('./paths/login.js');
const _login = require('./paths/_login.js');
const _logout = require('./paths/_logout.js');
const account = require('./paths/account.js');
const fees = require('./paths/fees.js');
const _pay = require('./paths/_pay.js');
const _callback = require('./paths/_callback.js');

require('./houseKeeping.js');

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

app.use(function (req, res, next) {
    //console.log(req.cookies);
    res.enroll = null;
    if (req.cookies.ticket == undefined) {
        next();
    }
    else {
        common.users.findOne({ ticket: req.cookies.ticket }, (err, rec) => {
            if(rec!=null){
                res.enroll=rec.enroll;
                res.name=rec.name;
            }
            next();
        })
    }
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/pages/home.html');
});

app.use(login);
app.use(_login);
app.use(_logout);
app.use(account);
app.use(fees);
app.use(_pay);
app.use(_callback);

app.use(function (req, res) {
    res.sendFile(__dirname + '/pages/404.html');
});
app.listen(port, () =>
    console.log(`Running on http://localhost:${port}`)
);