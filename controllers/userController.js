const { validationResult } = require("express-validator");
// const cookieParser = require('cookie-parser');
require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const UserController = class {
  //Afficher la page d'accueil
  // static getUser = (req, res) => {
  //   res.render("userPage")
  // };

  //Afficher la page de lutilisateur
  static getUserPage = (req, res) => {
    // const user = req.user;
    // const token = req.cookies.token;
    // if (user) {
    //   const users = await User.findById(user.id);
    //   res.json({ Users: users });
    // }
    // const token = req.headers.authorization.split(" ")[1];
    res.render("user/index");
    // res.redirect("/connexion");
  };

  // User profile
  static getUserProfile = (req, res) => {
    res.render("user/users-profile");
  };

  // User pages faq
  static getUserFaq = (req, res) => {
    res.render("user/pages-faq");
  };

  // User Contact
  static getUserContact = (req, res) => {
    res.render("user/pages-contact");
  };

  // User Discution
  static getUserDiscution = (req, res) => {
    res.render("user/pages-discution");
  };

  static sendMessage = (req, res) => {
    // res.send("Hello pen")
    console.log("User message: ");
  };

  // User Table data
  static getUserData = async (req, res) => {
    // const user = req.user;
    const users = await User.find();
    res.render("user/tables-data", {users:users});
  };

  //Deconnecter l'utilisateur
  static getUserLogOut = async (req, res) => {
    res.cookie("jwt", "", {
      maxAge: 1,
    });
    res.redirect("/");
    // res.redirect("/connexion");
  };

  //Afficher le formulaire d'enregistrement
  static getRegister = (req, res) => {
    res.render("register", {
      message: "",
      userinfos: "",
      success: null,
      error_msg: "",
    });
  };

  //Enregistrer un utilisateur
  static saveUser = (req, res) => {
    console.log(req.body);
    const { nom, prenom, email, password, repeatepassword } = req.body;
    // console.log(nom, prenom, password);
    const salt = bcrypt.genSaltSync(10);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.mapped();
      res.render("register", {
        message: error,
        userinfos: req.body,
        success: null,
        error_msg: "",
      });
    } else {
      const succes_msg = "Membre enregistrer avec succes";
      User.findOne({ email })
        .then((result) => {
          if (result) {
            console.log("email exit deja");
            res.render("register", {
              success: "",
              message: "",
              userinfos: req.body,
              error_msg: "Email exist déja",
            });
          } else {
            const hashPassword = bcrypt.hashSync(password, salt);
            console.log("Password hash", hashPassword);
            const user = new User({
              nom,
              prenom,
              email: email.toLowerCase(),
              password: hashPassword,
            });
            console.log("user", user);
            user
              .save()
              .then(() => {
                console.log("Enregistrement réussie");
                res.render("register", (msg = "Enregistrement réussie"));
              })
              .catch((err) => {
                console.log(err);
              });

            res.render("register", {
              message: "",
              userinfos: "",
              success: succes_msg,
              error_msg: "",
            });
          }
        })
        .catch((err) => {});
    }
  };

  //Afficher le formulaire de connexion
  static getConnexion = (req, res) => {
    res.render("connexionForm", { message: "", userinfos: "", error_msg: "" });
  };

  // Update User
  static EditUserProfile = (req, res) => {
    const id = req.body.id;
    const user = {
      userprofile: req.file.filename,
      nom: req.body.nom,
      prenom: req.body.prenom,
      country: req.body.country,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      linkedin: req.body.linkedin,
    };
    User.findByIdAndUpdate(id, { $set: user })
      .then(() => {
        console.log("User update");
        res.redirect("profile");
      })
      .catch((err) => {
        console.log("Update Error", err);
      });

    // console.log(req.body);
    // console.log(req.file);
    // console.log("req.file");
  };

  // Edit user password
  static updatePassword = async (req, res) => {
    const { password, newpassword, renewpassword } = req.body;
    const errors = validationResult(req);
    const id = req.body.id;
    const user = await User.findById(id);
    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      res.render("user/users-profile", { error, user });
      console.log("error", error);
    } else {
      // console.log("user", user);
      if (bcrypt.compareSync(password, user.password)) {
        console.log("Le mot de passe est bon");
        const updatePassword = bcrypt.hashSync(req.body.newpassword, 10);
        const userUpdatePassword = {
          password: updatePassword,
        };
        console.log("password hash", updatePassword);
        User.findByIdAndUpdate(user._id, { $set: userUpdatePassword })
          .then(() => {
            console.log("Password update");
          })
          .catch((err) => {
            console.log("Update password Error", err);
          });

        res.cookie("jwt", "", {
          maxAge: 1,
        });
        res.redirect("/");
      } else {
        console.log("Mot de passe incorrect");
      }
    }
  };

  //Connecter un utilisateur
  static userConnexion = async (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    if (!errors.isEmpty()) {
      const error = errors.mapped();
      console.log("Erreur: ", error);
      res.render("connexionForm", {
        message: error,
        userinfos: req.body,
        error_msg: "",
      });
    } else {
      let user = await User.findOne({ email });

      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign(
            {
              id: user._id,
              // email: user.email,
              // prenom: user.prenom,
            },
            process.env.SECRET_TOKEN,
            { expiresIn: "2d" }
          );

          // save user token
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
          });
          res.redirect("/user");
        } else {
          const error_msg = "Email ou mot de passe incorrecte";
          res.render("connexionForm", {
            error_msg,
            message: "",
            userinfos: req.body,
          });
        }
      }
      const error_msg = "Votre email n'existe pas, créez un compte";
      res.render("connexionForm", {
        error_msg,
        message: "",
        userinfos: req.body,
      });
    }
  };
};

module.exports = UserController;
