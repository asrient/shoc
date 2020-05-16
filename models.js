/**
 * @ASRIENT
 * created on 29,April 2020.
 * #DEFINES 
 * Schema & Model for users, students, fees, attendence, marks
 */
var mongoose = require('mongoose');

let student = new mongoose.Schema({
    enroll: { type: String, required: true, unique: true },
    joining_date: String,
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
    class: String,
    ticket: String
})

const users = mongoose.model('users', user);

let fee = new mongoose.Schema({
    enroll: String,
    paid_on: Number,
    order_id: String,
    cust_id:String,
    details:Object,
    ac_year: Number,
    required_amount:Number,
    received_amount: Number,
    month: Number,
    status: String,
    init_on: Number,
    mode: String
})

const fees = mongoose.model('fees', fee);

let due = new mongoose.Schema({
    enroll: String,
    month: Number,
    ac_year: Number
})

const dues = mongoose.model('dues', due);

module.exports = { students, users, fees, dues };