const express = require('express');
const Router = express.Router;
const common = require('../common.js');
const paytm = require('../paytm/checksum.js');

let app = Router();

function getAcceptingMonths() {
  const str = process.env.ACCEPTING_MONTHS;
  const arr = str.split(',');
  arr.forEach((month,ind) => {
    arr[ind] = parseInt(month);
  })
  return arr;
}

function generateHash(payload, cb) {
  paytm.genchecksum(payload, process.env.MERCHANT_KEY, function (err, checksum) {
    cb(checksum);
  });
}

function genarateOrder(enroll, month, amt, cb) {
  const orderId = 'ORDER_' + common.code(6);
  const ac_year = process.env.AC_YEAR;
  var custId = '';
  const init_on = common.time();
  enroll.split('/').forEach((chunk, ind) => {
    if (ind) {
      custId += '_';
    }
    custId += chunk;
  })
  const payload = {
    "MID": process.env.MID,
    "WEBSITE": process.env.WEBSITE,
    "INDUSTRY_TYPE_ID": process.env.INDUSTRY_TYPE_ID,
    "CHANNEL_ID": process.env.CHANNEL_ID,
    "ORDER_ID": orderId,
    "CUST_ID": custId,
    "TXN_AMOUNT": amt,
    "CALLBACK_URL": process.env.CALLBACK_URL,
  };
  generateHash(payload, (hash) => {
    var fee = new common.fees({
      enroll,
      cust_id: custId,
      init_on,
      order_id: orderId,
      status: 'WAITING',
      month,
      received_amount: 0,
      required_amount: amt,
      ac_year,
      mode: 'ONLINE'
    });
    fee.save((err) => {
      cb(payload, hash);  //
    });
  })
}

app.get('/_pay', (req, res) => {
  if (res.enroll != null) {
    if (req.query.month != undefined) {
      const payMonth = parseInt(req.query.month);
      var acceptingMonths = getAcceptingMonths();
      const ac_year = process.env.AC_YEAR;
      const monthly_fees = process.env.MONTHLY_FEES;
      var admission_fees = process.env.PREP_ADMISSION_FEES;
      common.dues.find({ enroll: res.enroll, ac_year }).exec((err, spDues) => {
        if(spDues!=null){
         spDues.forEach(spDue=>{
          acceptingMonths.push(parseInt(spDue.month));
        }) 
        }
        if (acceptingMonths.includes(payMonth)) {
          if (res.class == 'Lower') {
            admission_fees = process.env.LOWER_ADMISSION_FEES;
          }
          else if (res.class == 'Upper') {
            admission_fees = process.env.UPPER_ADMISSION_FEES;
          }
          common.fees.findOne({ enroll: res.enroll, ac_year, month: payMonth, status: 'PAID' }).exec((err, rec) => {
            if (rec == null) {
              var payAmt = monthly_fees;
              if (payMonth == 0) {
                payAmt = admission_fees;
              }
              genarateOrder(res.enroll, payMonth, payAmt, (payload, hash) => {
                res.render('pay', {
                  enroll: res.enroll,
                  name: res.name,
                  cls: res.class,
                  payload,
                  hash,
                  payName: common.months[payMonth] + ' fees',
                  amount: payAmt,
                  url: process.env.TRANSACTION_URL
                })   //
              })
            }
            else
              res.render('error', { message: 'Fee already paid: FEE_RECORD_EXISTS' });
          });
        }
        else
          res.render('error', { message: 'Not accepting fees for requested month: MONTH_NOT_IN_ACCEPTING_MONTHS' });
      })
    }
    else
      res.render('error', { message: 'Invalid Request: MISSING_QUERY_MONTH' });
  }
  else
    res.redirect('/login?next=' + req.url);
})

module.exports = app;