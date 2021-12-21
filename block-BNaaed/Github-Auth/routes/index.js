var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
})

router.get('/success', (req, res, next) => {
  res.render('success');
})

router.get('/failure', (req, res, next) => {
  res.render('failure');
})

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github',
  {failureRedirect: '/failure'}), (req, res) => {
    res.redirect('/success');
  })

module.exports = router;
