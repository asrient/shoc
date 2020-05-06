const express = require('express');
const Router = express.Router;
const common = require('../common.js');

let app = Router();

app.post('/_login', (req, res) => {
  const go = () => {
    if (req.query.next != undefined)
      res.redirect(req.query.next);
    else
      res.redirect('/account');
  }
  if (res.enroll == null) {
    if (req.body.enroll != undefined) {
      common.students.findOne({ enroll: req.body.enroll }, (err, stud) => {
        if (stud != null) {
          const ticket = common.code(18);
          const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
          var user = new common.users({ enroll: stud.enroll, name: stud.name, class: stud.class, ticket, expires_on: expires });
          user.save((err)=> {
            res.cookie('ticket', ticket, { expires });
            go();
          });
        }
        else
          res.render('error', { message: 'No such student found' });
      })

    }
    else {
      res.render('error', { message: 'Invalid request' })
    }
  }
  else
    go();
})

module.exports = app;