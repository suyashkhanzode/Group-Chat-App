const User = require("../models/user");
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secertKey = process.env.TOKEN_SECRET_KEY;

function generateAccessToken(user) {
   return jwt.sign({user : user},secertKey);
}

exports.signUp = (req, res, next) => {
  const { name, email, phnumber, password } = req.body;
  const saltRounds = 10;
  bycript.hash(password, saltRounds, (err, hash) => {
    User.create({
      name: name,
      email: email,
      ph_number: phnumber,
      password: hash,
    })
      .then((result) => {
        res.status(201).json({ status: true });
      })
      .catch((err) => {
        if (
          err.name === "SequelizeUniqueConstraintError" &&
          err.errors[0].type === "unique violation" &&
          err.errors[0].path === "email"
        ) {
          res.status(400).json({
            message: "User Already Exists. Please Login.",
          });
        } else {
          res.json({ message: err });
        }
      });
  });
};

exports.loginUser = async (req, res, next) => {
 
  const email = req.body.email;
  const password = req.body.password;

  try {
   
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found with provided email.",
      });
    }
    bycript.compare(password, user.password, (err, result) => {
      if (result) {

        res.status(200).json({
          message: "User authenticated successfully.",
          token: generateAccessToken(user)
        });
      } else {
        res.status(401).json({
          message: "Invalid password.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while searching for the user.",
      error: error,
    });
  }
};
