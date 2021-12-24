let express = require('express');
let Comment = require('../models/comment');
let auth = require('../middlewares/auth');
const { route } = require('.');
const Article = require('../models/article');

let router = express.Router();

router.get('/new', (req, res, next) => {
  res.render('index');
})

router.get('/:id/like', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, comment) => {
    if(err){
      return next(err);   
    }
    res.redirect('/articles/' + comment.articleId);
  })
})


router.get('/:id/dislike', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {dislikes: 1}}, (err, comment) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + comment.articleId);
  })
})

router.get('/:id/edit', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if(err){
      return next(err);
    }
    res.render('updateComment', { comment });
  });
})

router.post('/:id/edit',  auth.UserLoggedIn,(req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if(err){
      return next(err);
    }
    res.redirect('/users/' + updatedComment.author + '/info');
  });
});

router.get('/:id/delete',  auth.UserLoggedIn,(req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, deletedComment) => {
    if(err){
      return next(err);
    }
    Article.findByIdAndUpdate(deletedComment.articleId, {$pull: {comments: deletedComment.id}}, (err, updatedArticle) => {
      if(err){
        return next(err);
      }
      res.redirect('/users/' + updatedArticle.author + '/info');
    })
  });
})

module.exports = router;