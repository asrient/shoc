const express = require('express');
const Router = express.Router;
const common = require('../common.js');

let app = Router();

const KEY = process.env.ADMIN_KEY || 'admin'


function paidObj(doc) {

  var dt = '';
  if (doc.init_on != undefined) {
    dt = new Date(doc.init_on).toLocaleDateString();
  }
  return {
    enroll: doc.enroll,
    amount: doc.received_amount,
    date: dt,
    via: doc.via,
    order_id: doc.order_id
  };
}

app.get('/admin/payments/:month', (req, res) => {
  if (res.isAdmin) {
    var month = parseInt(req.params.month);
    const ac_year = process.env.AC_YEAR;
    common.fees.find({ status: 'PAID', ac_year, month }).sort({ 'init_on': -1 }).exec((err, recs) => {
      var paids = []
      if(recs.length){
      recs.forEach((rec) => {
        common.students.findOne({ enroll: rec.enroll }, (err, stud) => {
          obj = paidObj(rec);
          if (stud) {
            obj.name = stud.name
          }
          paids.push(obj);
          if (paids.length == recs.length) {
            res.render('a_pay_month', { history: paids, month: common.months[month] })
          }
        })
      })
    }
    else{
      res.render('a_pay_month', { history: [], month: common.months[month] })
    }
    })

  }
  else
    res.redirect('/admin/login');
})

app.get('/admin', (req, res) => {
  if (res.isAdmin) {
    res.render('admin', { enroll: res.enroll, name: res.name, cls: res.class })
  }
  else
    res.redirect('/admin/login');
})

app.post('/admin/_login', (req, res) => {
  const go = () => {
    if (req.query.next != undefined)
      res.redirect(req.query.next);
    else
      res.redirect('/admin');
  }
  if (!res.isAdmin) {
    if (req.body.key != undefined) {
      if (KEY == req.body.key) {
        const ticket = common.code(18);
        const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        var user = new common.users({ is_admin: true, ticket, expires_on: expires });
        user.save((err) => {
          res.cookie('ticket', ticket, { expires });
          go();
        });
      }
      else
        res.render('error', { message: 'INVALID KEY' });
    }
    else {
      res.render('error', { message: 'Invalid request' })
    }
  }
  else
    go();
})

app.get('/admin/login', (req, res) => {
  if (res.isAdmin) {
    if (req.query.next != undefined)
      res.redirect(req.query.next);
    else
      res.redirect('/admin');
  }
  else {
    res.render('a_login', { next: req.query.next });
  }
})

module.exports = app;