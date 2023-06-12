
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const baseDeDatos = 'si esta es'

app.get("/", (req, res, next) => {
  res.send(baseDeDatos);
});

console.log(baseDeDatos);

app.listen(process.env.PORT || 3400);

// mongoose
//   .connect(baseDeDatos)
//   .then(() => {
//     app.listen(process.env.PORT || 3400);
//     console.log("conecto");
//   })
//   .catch((error) => {
//     console.log(error);
//   });
