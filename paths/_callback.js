const express = require('express');
const Router = express.Router;
const common = require('../common.js');
const paytm = require('../paytm/checksum.js');
const {getDetails} = require('../payments.js');

let app = Router();

function getAcceptingMonths() {
  const str = process.env.ACCEPTING_MONTHS;
  const arr = str.split(',');
  arr.forEach((month,ind) => {
    arr[ind] = parseInt(month);
  })
  return arr;
}

function verifyHash(payload, cb) {
  var hash = "";
  var paytmParams = {};
  for (var key in payload) {
    if (key == "CHECKSUMHASH") {
      hash = payload[key];
    }
    else {
      paytmParams[key] = payload[key];
    }
  }
  const isValidChecksum = paytm.verifychecksum(paytmParams, process.env.MERCHANT_KEY, hash);
  cb(isValidChecksum);
}

app.post('/_callback', (req, res) => {
  if (res.enroll != null) {
    const acceptingMonths = getAcceptingMonths();
    const ac_year = process.env.AC_YEAR;
    const monthly_fees = process.env.MONTHLY_FEES;
    const admission_fees = process.env.ADMISSION_FEES;

    const payload = req.body;
    if (payload.ORDERID != undefined) {
      const orderId = payload.ORDERID;
      verifyHash(payload, (isValid) => {
        if (isValid) {
          common.fees.findOne({ enroll: res.enroll, ac_year, order_id: orderId }, (err, fee) => {
            if (fee != null) {
              if (fee.status == 'PAID') {
                //fee already paid
                console.log("fee already paid!");
                res.render('callback', { enroll: res.enroll, name: res.name, cls: res.class, orderId, amount: fee.received_amount })//
              }
              else {
                getDetails(orderId, (data) => {
                  if (data.STATUS == 'PENDING') {
                    res.render('error', { message: 'TRANSACTION STATUS: ' + data.status });
                  }
                  else {
                    var title = "";
                    if (data.STATUS == 'TXN_SUCCESS') {
                      console.log("payment successful");
                      title = "Payment Successful!";
                      const amt = parseInt(data.TXNAMOUNT);
                      const paidOn = common.time();
                      if (amt != fee.required_amount) {
                        console.error("Required amount not received!", amt, fee.required_amount);
                      }
                      fee.received_amount = amt;
                      fee.paid_on = paidOn;
                      fee.status = 'PAID';
                      fee.details = data;
                    }
                    else if (data.STATUS == 'TXN_FAILURE') {
                      title = "Payment Failed!";
                      fee.status = 'FAILED';
                    }
                    fee.save((err) => {
                      res.render('callback', { enroll: res.enroll, name: res.name, cls: res.class, title, orderId, amount: fee.received_amount })//
                    })
                  }
                })
              }
            }
            else
              res.render('error', { message: 'ORDERID_NOT_IN_RECORDS' });
          });
        }
        else
          res.render('error', { message: 'Corrupted data: HASH_MISMATCH' });
      })
    }
    else
      res.render('error', { message: 'Invalid data received: ORDERID_NOT_PROVIDED' });
  }
  else
    res.redirect('/login?next=/fees');
})

module.exports = app;