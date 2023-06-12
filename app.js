//require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

const tarjetaEsquema = mongoose.Schema({
  anverso: { type: String },
  reverso: { type: String },
  categoria: { type: String },
});

const tarjetaModelo = mongoose.model("tarjetas", tarjetaEsquema);

const categoriaEsquema = mongoose.Schema({
  titulo: { type: String },
  tarjetasIds: [{ type: String }],
});

const categoriaModelo = mongoose.model("categorias", categoriaEsquema);

app.get("/", async (req, res, next) => {
  const tarjetas = await tarjetaModelo.find();

  const categorias = await categoriaModelo.find();

  const data = {
    tarjetas,
    categorias,
  };

  res.json(data);
});

app.get("/:id", async (req, res, next) => {
  const tarjeta = await tarjetaModelo.findById(req.params.id);

  res.json(tarjeta);
});


mongoose
  .connect(process.env.BASE)
  .then(() => {
    app.listen(process.env.PORT || 3400);
    console.log("conecto");
  })
  .catch((error) => {
    console.log("Algo paso");
  });
