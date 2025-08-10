const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')


exports.userLogin = (req, res, next) => {
 let user ;
  // 1) check if the user email exsit
  User.findOne({ email: req.body.email })
    .then((user_details) => {
      // if the user is not present return with error
      if (!user_details) {
        return res.status(500).json({
          message: "User is not registered",
        });
      }
      user = user_details
      // If the user is present
      // 2)check if the password entered is correct
      //   here we  cannot decrypt the function
      //   but bcrypt will encode the string same every time we enter it
      //   so we can just encrypt the entererd password
      //   and then comapre it with the stored password
      //   for this bcrypt provides a function called compare()
      console.log("req.body.password",req.body.password)
      console.log("user_details.password",user_details.password)
      return bcrypt.compare(req.body.password, user_details.password);

    })
    .then(result => {
        console.log("result",result)
    // 3) we get result in boolean 
    // depending on if the password is coreect or not
      if (!result) {
        return res.status(500).json({
          message: "Invalid Credentials",
        });
      }

    // 4) if the email and password both are correct 
    // generate the jwt token (json web token)
    const token = jwt.sign(
        {
        email : user.email,
        userId : user._id,
        },
        'secret_this_should_be_longer',
        {
            expiresIn : "1h"     
        }
      )

    res.status(200).json({
        token:token,
        expiresIn:3600,
        userId : user._id
    })

    })
    .catch((err) => {
      return res.status(500).json({
        message: "User Auth Failed",
      });
    });
};

exports.registerUser = (req, res, next) => {
  // pass, number Higher the number greater the security
  bcrypt.hash(req.body.password, 5).then((hash) => {
    console.log("hash",hash)
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    console.log("user",user)
    user.save()
      .then((result) => {
        console.log("res", result);
        res.status(201).json({
          message: "User Registered",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "User already registered",
        });
      });
  });
};
