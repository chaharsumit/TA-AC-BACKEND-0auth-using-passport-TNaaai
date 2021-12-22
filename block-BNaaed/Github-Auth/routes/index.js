var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  let message = req.flash("logout");
  res.render('index', { message });
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
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google',
  {failureRedirect: '/failure'}), (req, res) => {
    res.redirect('/success');
})

router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash("logout", "Logged Out successfully");
  res.redirect('/');
})

module.exports = router;