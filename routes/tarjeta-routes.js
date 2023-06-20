const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const tarjetaEsquema = mongoose.Schema({
  anverso: { type: String },
  reverso: { type: String },
  categoria: { type: String },
  usuario: { type: String },
});

const tarjetaModelo = mongoose.model("tarjetas", tarjetaEsquema);

const categoriaEsquema = mongoose.Schema({
  titulo: { type: String },
  tarjetasIds: [{ type: String }],
  usuario: { type: String },
});

const categoriaModelo = mongoose.model("categorias", categoriaEsquema);

router.post("/", async (req, res, next) => {
  const { anverso, reverso, categoria, usuario } = req.body;

  const tarjeta = new tarjetaModelo({
    anverso,
    reverso,
    categoria,
    usuario,
  });

  await tarjeta.save();

  const categoriaDB = await categoriaModelo.findOne({ titulo: categoria });

  if (!categoriaDB) {
    const categoriaNueva = new categoriaModelo({
      titulo: categoria,
      tarjetasIds: [tarjeta._id],
      usuario,
    });
    await categoriaNueva.save();
  } else {
    categoriaDB.tarjetasIds.push(tarjeta._id);
    categoriaDB.usuario = usuario;
    await categoriaDB.save();
  }

  res.json(tarjeta);
});

router.get("/usuario/:usuario", async (req, res, next) => {
  const usuario = req.params.usuario;

  const tarjetas = await tarjetaModelo.find({ usuario: usuario });
  const categorias = await categoriaModelo.find({ usuario: usuario });

  const data = {
    tarjetas,
    categorias,
  };

  res.json(data);
});

router.get("/:id", async (req, res, next) => {
  const tarjeta = await tarjetaModelo.findById(req.params.id);

  res.json(tarjeta);
});

router.get("/categoria/:titulo", async (req, res, next) => {
  const categoriaTitulo = req.params.titulo;

  const tarjetas = await tarjetaModelo.find({ categoria: categoriaTitulo });

  const categorias = await categoriaModelo.find();

  const data = {
    tarjetas,
    categorias,
  };

  res.json(data);
});

router.patch("/:id", async (req, res, next) => {
  const { anverso, reverso, categoria, usuario } = req.body;

  const tarjeta = await tarjetaModelo.findById(req.params.id);

  if (!tarjeta) {
    res.json("ya no existe");
    return;
  }

  const categoriaAnterior = tarjeta.categoria;

  tarjeta.anverso = anverso;
  tarjeta.reverso = reverso;
  tarjeta.categoria = categoria;
  tarjeta.usuario = usuario;

  await tarjeta.save();

  if (categoria != categoriaAnterior) {
    const categoriaDB = await categoriaModelo.findOne({ titulo: categoria });

    if (!categoriaDB) {
      const categoriaNueva = new categoriaModelo({
        titulo: categoria,
        tarjetasIds: [tarjeta._id],
        usuario,
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

router.delete("/:id", async (req, res, next) => {
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

module.exports = router;
