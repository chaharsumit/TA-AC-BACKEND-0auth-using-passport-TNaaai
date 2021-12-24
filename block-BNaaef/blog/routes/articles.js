let express = require('express');
let User = require('../models/user');
let Article = require('../models/article');
let Comment = require('../models/comment');
var auth = require('../middlewares/auth');
let router = express.Router();

router.get('/', (req, res, next) => {
  Article.find({}).populate('author').exec((err, articles) => {
    if(err){
      return next(err);
    }
    res.render('blogs', { articles });
  })
})

router.post('/', auth.UserLoggedIn,(req, res, next) => {
  req.body.author = req.user._id;
  Article.create(req.body, (err, article) => {
    if(err){
      return next(err);
    }
    User.findByIdAndUpdate(req.user.id, {$push: {articles: req.user.id}}, (err, user) => {
      if(err){
        return next(err);
      }
      res.redirect('/articles');
    })
  })
})

router.get('/new', auth.UserLoggedIn,(req, res, next) => {
  res.render('createArticle');
})

router.get('/:id', (req, res, next) => {  
  let id = req.params.id;
  Article.findById(id).populate("author", "email username").populate("comments").exec((err, article) => {
    if(err){
      return next(err);
    }
    res.render("articleDetails", { article });
  })
})

router.get('/:id/like', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, article) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + id);
  })
})

router.get('/:id/dislike', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {dislikes: 1}}, (err, article) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + id);
  })
})

router.post('/:id/comment', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  req.body.author = req.user.id;
  Comment.create(req.body, (err, comment) => {
    if(err){
      return next(err);
    }
    Article.findByIdAndUpdate(id, {$push: {comments: comment.id}}, (err, article) => {
      if(err){
        return next(err);
      }
      User.findByIdAndUpdate(req.user.id, {$push: {comments: comment.id}}, (err, user) => {
        if(err){
          return next(err);
        }
        res.redirect('/articles/' + id);
      })
    })
  })
})

router.get('/:id/edit', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if(err){
      return next(err);
    }
    if(req.user.id === article.author.toString()){
      res.render('updateArticle', { article });
    }else{
      req.flash("error", "ids dont match");
      res.redirect('/articles/' + id);
    }
  })
})

router.post('/:id/edit', auth.UserLoggedIn,(req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
    if(err){
      return next(err);
    }
    res.redirect('/users/' + updatedArticle.author + '/info');
  })
})

router.get('/:id/delete', auth.UserLoggedIn,(req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, deletedArticle) => {
    if(err){
      return next(err);
    }
    Comment.deleteMany({$exists: {author: deletedArticle.author}}, (err, deletedComments) => {
      if(err){
        return next(err);
      }
      res.redirect('/users/' + deletedArticle.author + '/info');
    })
  })
})

module.exports = router;