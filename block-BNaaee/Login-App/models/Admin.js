let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let adminSchema = new Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: String,
}, { timestamps: true });

userSchema.pre("save", function(next){
  if(this.password && this.isModified("password")){
    bcrypt.hash(this.password, (err, hashedValue) =>{
      if(err){
        return next(err);
      }
      this.password = hashedValue;
      return next();
    });
  }else{
    return next();
  }
})

userSchema.methods.verifyPassword = function(password, cb){
  bcrypt.compare(password, this.password, (err, result) =>{
    return cb(err, result);
  })
}

let Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;