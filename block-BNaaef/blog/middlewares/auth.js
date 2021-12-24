var User = require('../models/user');
var Article = require('../models/article');
var Comment = require('../models/comment');
module.exports = {
  UserLoggedIn: (req, res, next) => {
    if(req.session && req.session.userId){
      next();
    }else{
      req.flash('error', "You haven't logged in yet, Please login to continue!!");
      res.redirect("/users");
    }
  },

  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    if(userId){
      User.findById(userId, "username email",(err, user) => {
        if(err){
          return next(err);
        }
        req.user = user;
        res.locals.user = user;
        next();
      })
    }else{
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
}