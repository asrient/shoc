var crypto = require('crypto');

time = () => { return new Date().getTime(); }
code = (length = 10) => { return crypto.randomBytes(length).toString('hex'); }

const users = require('./models.js').users;
const students = require('./models.js').students;
const fees = require('./models.js').fees;

const baseDir = __dirname;

const months = [
    'Session & others',
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

module.exports = { time, code, users, students, fees, baseDir, months };