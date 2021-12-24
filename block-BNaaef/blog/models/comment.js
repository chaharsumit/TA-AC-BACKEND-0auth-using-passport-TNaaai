let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let commentSchema = new Schema({
  comment: String,
  articleId: { type: Schema.Types.ObjectId, ref: "Article" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
})

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;