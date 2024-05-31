const User = require('../models/user');
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secertKey = process.env.TOKEN_SECRET_KEY;



exports.signUp = (req,res,next) =>{
    const {name,email,phnumber,password} = req.body;
    bycript.hash(password, saltRounds, (err, hash) => {
        User.create({
          name: name,
          email: email,
          ph_number : phnumber,
          password: hash
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
            }
            res.json({ message: err });
          });
      });
}