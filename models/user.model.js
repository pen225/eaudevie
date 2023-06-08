const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserPost = new Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_online: { type: String, default: '0' },
    country: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    userprofile: { data: String, contentType: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserPost);
module.exports = User;
