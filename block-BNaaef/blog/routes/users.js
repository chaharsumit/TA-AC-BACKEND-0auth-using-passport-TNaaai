var express = require('express');
var User = require('../models/user');
var Article = require('../models/article');
var Comment = require('../models/comment');
var auth = require('../middlewares/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  let error = req.flash("error");
  res.render('userLogin', { error });
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    req.flash("error", 'Email/Password required');
    return res.redirect('/users');
  }
  User.findOne({ email }, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      req.flash("error", "Invalid credential kindly register if not registered yet!");
      return res.redirect('/users/register');
    }
    user.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        req.flash("error", "Password didn't match try again!!");
        return res.redirect('/users');
      }
      req.session.userId = user.id;
      res.redirect('/');
    });
  })
})

router.get('/register', (req, res, next) => {
  res.render('userRegister');
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err){
      return next(err);
    }
    res.redirect('/');
  })
})

router.get('/:id/info', auth.UserLoggedIn,(req, res, next) => {
  let id = req.params.id;
  Article.find({$exists: {author: id}}, (err, articles) => {
    if(err){
      return next(err);
    }
    Comment.find({$exists: {author: id}}, (err, comments) => {
      if(err){
        return next(err);
      }
      res.render('userInfo', { articles, comments });
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect('/');
})


module.exports = router;