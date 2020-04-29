/**
 * @ASRIENT
 * created on 29,April 2020.
 * #DEFINES 
 * Schema & Model for users, students, fees, attendence, marks
 */
var mongoose = require('mongoose');

let student = new mongoose.Schema({
    enroll: { type: String, required: true, unique: true },
    joining_year: Number,
    name: String,
    birthdate: String,
    phone_no: Number,
    address: String,
    class: String
})

const students = mongoose.model('students', student);

let user = new mongoose.Schema({
    enroll: String,
    expires_on: Number,
    name: String,
    ticket: String
})

const users = mongoose.model('users', user);

let fee = new mongoose.Schema({
    enroll: String,
    payed_on: Number,
    order_id: String,
    ac_year: Number,
    amount: Number,
    month: Number,
    type: String,
    status: String,
    init_on: Number
})

const fees = mongoose.model('fees', fee);

module.exports = { students, users, fees };