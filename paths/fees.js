const express = require('express');
const Router = express.Router;
const common = require('../common.js');
const { getDetails, recheck } = require('../payments.js');

let app = Router();

function getAcceptingMonths() {
  const str = process.env.ACCEPTING_MONTHS;
  const arr = str.split(',');
  arr.forEach((month,ind) => {
    arr[ind] = parseInt(month);
  })
  return arr;
}

function dueObj(cls, month) {
  const ac_year = process.env.AC_YEAR;
  const monthly_fees = process.env.MONTHLY_FEES;
  var admission_fees = process.env.PREP_ADMISSION_FEES;
  if (cls == 'Lower') {
    admission_fees = process.env.LOWER_ADMISSION_FEES;
  }
  else if (cls == 'Upper') {
    admission_fees = process.env.UPPER_ADMISSION_FEES;
  }
  var payAmt = monthly_fees;
  if (month == 0) {
    payAmt = admission_fees;
  }
  return { month, name: common.months[month] + ' fees', amount: payAmt, url: '/_pay?month=' + month };
}

function historyObj(doc) {
  var color = 'red';
  if (doc.status == 'PAID') {
    color = 'green'
  }
  else if (doc.status == 'WAITING') {
    color = 'orange';
  }
  var dt='';
  if(doc.init_on!=undefined){
    dt=new Date(doc.init_on).toLocaleDateString();
  }
  return {
    month: doc.month,
    name: common.months[doc.month] + ' fees',
    amount: doc.received_amount,
    status: doc.status,
    date: dt,
    via: doc.via,
    order_id: doc.order_id,
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
      var paidMonths = [];
      recs.forEach((rec) => {
        if (rec.status == 'PAID') {
          paidMonths.push(rec.month);
          var dInd = dueMonths.findIndex((due) => { return due == rec.month });
          if (dInd >= 0) {
            dueMonths.splice(dInd, 1);
          }
        }
        history.push(historyObj(rec));
      })
      common.dues.find({ enroll: res.enroll, ac_year }).exec((err, spDues) => {
        spDues.forEach((rec) => {
          if (!paidMonths.includes(rec.month) && !dueMonths.includes(rec.month)) {
            dueMonths.push(rec.month);
          }
        })
        const dues = dueMonths.map((month) => { return dueObj(res.class, month) })
        res.render('fees', { enroll: res.enroll, name: res.name, cls: res.class, dues, history })
      })
    });
  }
  else
    res.redirect('/login?next=/fees');
})

app.post('/api/recheck', (req, res) => {
  if (res.enroll) {
    const ac_year = process.env.AC_YEAR;
    recheck({ ac_year, enroll:res.enroll }, () => {
      res.status(201).json({msg:'rechecked'});
    })
  }
  else
    res.status(401).json({msg:'unauthorised'});
})

module.exports = app;