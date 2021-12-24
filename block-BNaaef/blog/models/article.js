let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: String,
  description: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  slug: String,
}, { timestamps: true });

articleSchema.pre("save", function(next){
  this.slug = this.title.toLowerCase().split(' ').join('-');
  next();
})

let Article = mongoose.model('Article', articleSchema);

module.exports = Article;