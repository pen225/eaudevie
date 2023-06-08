require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const verifyToken = (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, process.env.SECRET_TOKEN, (err) => {
        if (err) {
          console.log(err.message);
          res.redirect("/connexion");
        } else {
          next();
        }
      });
    } else {
      // res.status(401).json({ message: "Unauthorized User" });
      res.redirect("/connexion");
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized User" });
  }
};

module.exports = {verifyToken, checkUser};

// if (token) {
//   token = token.split(" ")[1];
//   let user = jwt.verify(token, process.env.SECRET_TOKEN);
//   req.user = user;
// } else {
//   res.status(401).json({ message: "Unauthorized User" });
// }
