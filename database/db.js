const mongoose = require("mongoose");
require('dotenv').config();
const uri = process.env.DB_URI;


const connectDb = () => mongoose.connect(uri).then(() => {
    console.log("Connecter à la base de données avec succès");
}).catch((err) => {
    console.log("Errreur de connexion à la base de données", err);
});

module.exports = connectDb;