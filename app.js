const express = require("express");
const mongoose = require("mongoose");
const { baseDeDatos } = require("./env.js");

const app = express();

app.get("/", (req, res, next) => {
  res.send("Hola mis mejores amigos");
});

app.listen(process.env.PORT || 3400);

// const db = mongoose.connection;
// db.on("error", (error) => {
//   console.error(error);
// });
// db.once("open", () => {
//   console.log("conectado a Mongoose");

//   app.listen(process.env.PORT || 3400);
// });

//
