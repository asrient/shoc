const express = require('express');
const Router = express.Router;
const common = require('../common.js');

let app = Router();

function getAcceptingMonths() {
  const str = process.env.ACCEPTING_MONTHS;
  const arr = str.split(',');
  arr.forEach((month) => {
    month = Number(month);
  })
  return arr;
}

function genarateOrder(enroll, month, amt, cb) {
  const orderId = common.code(10);
  cb(orderId);  //
}


app.get('/_pay', (req, res) => {
  if (res.enroll != null) {
    if (req.query.month != undefined) {
      const payMonth = req.query.month;
      const acceptingMonths = getAcceptingMonths();
      if (acceptingMonths.includes(payMonth)) {
        const ac_year = process.env.AC_YEAR;
        const monthly_fees = process.env.MONTHLY_FEES;
        const admission_fees = process.env.ADMISSION_FEES;
        common.fees.findOne({ enroll: res.enroll, ac_year, month: payMonth,status:'PAYED' }).exec((err, rec) => {
          if (rec == null) {
            var payAmt = monthly_fees;
            if (payMonth == 0) {
              payAmt = admission_fees;
            }
            genarateOrder(res.enroll, payMonth, payAmt, (orderId) => {
              res.render('pay', { enroll: res.enroll, name: res.name, orderId })   //
            })
          }
          else
            res.render('error', { message: 'Fee already paid: FEE_RECORD_EXISTS' });
        });
      }
      else
        res.render('error', { message: 'Not accepting fees for requested month: MONTH_NOT_IN_ACCEPTING_MONTHS' });

    }
    else
      res.render('error', { message: 'Invalid Request: MISSING_QUERY_MONTH' });

  }
  else
    res.redirect('/login?next=' + req.url);
})

module.exports = app;