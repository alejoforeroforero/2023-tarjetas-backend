
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.get("/", (req, res, next) => {
  res.send(process.env.BASE);
});



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
