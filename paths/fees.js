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

function dueObj(month) {
  const ac_year = process.env.AC_YEAR;
  const monthly_fees = process.env.MONTHLY_FEES;
  const admission_fees = process.env.ADMISSION_FEES;
  var payAmt = monthly_fees;
  if (month == 0) {
    payAmt = admission_fees;
  }
  return { month, name: common.months[month]+' fees', amount: payAmt, url: '/_pay?month=' + month };
}

function historyObj(doc) {
  var color='red';
  if(doc.status=='PAID'){
    color='green'
  }
  else if(doc.status=='WAITING'){
    color='orange';
  }
  return { month: doc.month,
     name: common.months[doc.month]+' fees', 
     amount: doc.received_amount, 
     status: doc.status,
     date:new Date(doc.init_on).toLocaleDateString(),
     via:doc.via,
     order_id:doc.order_id,
     color
     };
}

app.get('/fees', (req, res) => {
  if (res.enroll != null) {
    const acceptingMonths = getAcceptingMonths();
    const ac_year = process.env.AC_YEAR;
    const monthly_fees = process.env.MONTHLY_FEES;
    const admission_fees = process.env.ADMISSION_FEES;
    common.fees.find({ enroll: res.enroll, ac_year }).sort({ 'init_on': -1 }).exec((err, recs) => {
      var history = [];
      var dueMonths = acceptingMonths;
      recs.forEach((rec) => {
        if (rec.status == 'PAID') {
          var dInd = dueMonths.findIndex((due) => { return due == rec.month });
          if (dInd >= 0) {
            dueMonths.splice(dInd, 1);
          }
        }
        history.push(historyObj(rec));
      })
      const dues = dueMonths.map((month) => { return dueObj(month) })
      res.render('fees', { enroll: res.enroll, name: res.name, dues, history })
    });
  }
  else
    res.redirect('/login?next=/fees');
})

module.exports = app;