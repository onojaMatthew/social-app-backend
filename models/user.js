const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  about: {
    type: String,
    trim: true
  }
});

userSchema.virtual("password")
  .set(function(password) {
    //create a temporary variable called _password
    this._password = password;

    // generate timestamp
    this.salt = uuidv1();

    //encrypt password
    this.hashed_password = this.encryptPassword(password);

  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch(err) {
      return ""
    }
  }
}

const User = mongoose.model("User", userSchema);

exports.User = User;
