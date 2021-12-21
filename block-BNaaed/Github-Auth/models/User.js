var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: String,
  email: { type: String, required:true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: String
}, { timestamps: true });

let User = mongoose.model('User', userSchema);

module.exports = User;