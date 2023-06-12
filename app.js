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

app.post("/", async (req, res, next) => {
  const { anverso, reverso, categoria } = req.body;

  const tarjeta = new tarjetaModelo({
    anverso,
    reverso,
    categoria,
  });

  await tarjeta.save();

  const categoriaDB = await categoriaModelo.findOne({ titulo: categoria });

  if (!categoriaDB) {
    const categoriaNueva = new categoriaModelo({
      titulo: categoria,
      tarjetasIds: [tarjeta._id],
    });
    await categoriaNueva.save();
  } else {
    categoriaDB.tarjetasIds.push(tarjeta._id);
    await categoriaDB.save();
  }

  res.json(tarjeta);
});

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

app.get("/categoria/:titulo", async (req, res, next) => {
  const categoriaTitulo = req.params.titulo;

  const tarjetas = await tarjetaModelo.find({ categoria: categoriaTitulo });

  const categorias = await categoriaModelo.find();

  const data = {
    tarjetas,
    categorias,
  };

  res.json(data);
});

app.patch("/:id", async (req, res, next) => {
  const { anverso, reverso, categoria } = req.body;

  const tarjeta = await tarjetaModelo.findById(req.params.id);

  if (!tarjeta) {
    res.json("ya no existe");

    return;
  }

  const categoriaAnterior = tarjeta.categoria;

  tarjeta.anverso = anverso;
  tarjeta.reverso = reverso;
  tarjeta.categoria = categoria;

  await tarjeta.save();

  if (categoria != categoriaAnterior) {
    const categoriaDB = await categoriaModelo.findOne({ titulo: categoria });

    if (!categoriaDB) {
      const categoriaNueva = new categoriaModelo({
        titulo: categoria,
        tarjetasIds: [tarjeta._id],
      });

      await categoriaNueva.save();
    } else {
      categoriaDB.tarjetasIds.push(tarjeta._id);

      await categoriaDB.save();
    }

    const categoriaAnteriorDB = await categoriaModelo.findOne({
      titulo: categoriaAnterior,
    });
    const index = categoriaAnteriorDB.tarjetasIds.indexOf(tarjeta._id);

    if (index > -1) {
      categoriaAnteriorDB.tarjetasIds.splice(index, 1);
    }

    await categoriaAnteriorDB.save();

    if (categoriaAnteriorDB.tarjetasIds.length < 1) {
      await categoriaModelo.findByIdAndDelete(categoriaAnteriorDB._id);
    }
  }

  res.json(tarjeta);
});

app.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  const tarjeta = await tarjetaModelo.findById(id);

  if (!tarjeta) {
    res.json("ya no existe");

    return;
  }

  const categoriaDB = await categoriaModelo.findOne({
    titulo: tarjeta.categoria,
  });

  const index = categoriaDB.tarjetasIds.indexOf(tarjeta._id);

  categoriaDB.tarjetasIds.splice(index, 1);

  await categoriaDB.save();

  if (categoriaDB.tarjetasIds.length < 1) {
    await categoriaModelo.findByIdAndDelete(categoriaDB._id);
  }

  await tarjetaModelo.findByIdAndDelete(id);

  res.json("se borró el record");
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
