require('dotenv').config();
const express = require('express');
const path = require('path');

const port = process.env.PORT || 2000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('exposed'));

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

app.use(function (req, res) {
    res.sendFile(__dirname + '/pages/404.html');
});
app.listen(port, () =>
    console.log(`Running on http://localhost:${port}`)
);