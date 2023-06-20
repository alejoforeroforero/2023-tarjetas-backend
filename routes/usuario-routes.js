const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();

const usuarioEsquema = mongoose.Schema({
  nombre: { type: String },
  email: { type: String },
  password: { type: String },
});

const usuarioModelo = mongoose.model("usuarios", usuarioEsquema);

router.post(
  "/signup",
  [
    check("nombre").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send("Hay errores");
      return;
    }

    const { nombre, email, password } = req.body;

    const usuarioDB = await usuarioModelo.findOne({ email: email });

    if (usuarioDB) {
      res.send("el usuario ya exista, haz loggin");
      return;
    }

    const hashedP = await bcrypt.hash(password, 12);

    const usuario = new usuarioModelo({
      nombre,
      email,
      password: hashedP,
    });

    await usuario.save();

    const usuarioData = {
      nombre,
      email,
    };

    res.json(usuarioData);
  }
);

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const usuarioDB = await usuarioModelo.findOne({ email: email });

  if (!usuarioDB) {
    res.json("No esiste el usuario");
    return;
  }

  const passwordBueno = await bcrypt.compare(password, usuarioDB.password);

  if (!passwordBueno) {
    res.json("El password está mal");
    return;
  }

  const token = jwt.sign({ userId: usuarioDB._id }, "clave_secreta", {
    expiresIn: "1h",
  });

  const usuarioData = {
    id: usuarioDB._id,
    nombre: usuarioDB.nombre,
    email: usuarioDB.email,
    token,
  };

  res.json({ usuarioData });
});

module.exports = router;
