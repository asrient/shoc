var crypto = require('crypto');

time = () => { return new Date().getTime(); }
code = (length = 10) => { return crypto.randomBytes(length).toString('hex'); }

const users = require('./models.js').users;
const students = require('./models.js').students;
const fees = require('./models.js').fees;

module.exports = { time, code, users, students, fees };