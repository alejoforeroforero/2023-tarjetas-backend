
const express = require("express");
const mongoose = require("mongoose");

// require("dotenv").config();

const app = express();

app.get("/", (req, res, next) => {
  res.send('listo');
});

app.listen(process.env.PORT || 3300);

mongoose
  .connect(process.env.BASE)
  .then(() => {
    app.listen(process.env.PORT || 3400);
    console.log("conecto");
  })
  .catch((error) => {
    console.log(error);
  });
