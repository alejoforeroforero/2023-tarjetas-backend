//require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usuarioRoutes = require("./routes/usuario-routes");
const tarjetasRoutes = require("./routes/tarjeta-routes");

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tarjetas", tarjetasRoutes);

mongoose
  .connect(process.env.BASE)
  .then(() => {
    app.listen(process.env.PORT || 3400);
    console.log("conecto");
  })
  .catch((error) => {
    console.log("Algo paso");
  });
