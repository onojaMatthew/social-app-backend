const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();

exports.signup = async (req, res, next) => {
  const userExists = await User.findOne({ email: req.body.email});
  if (userExists) 
    return res.status(403).json({
       error: "Email already taken!!"
      });
  
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Sign up success! Please log in" });
}

exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with the email does not exist. Please sign up."
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match"
      });
    };

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email }});

  });
}

exports.signout = (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Signout success!!" });
};
