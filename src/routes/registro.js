const express = require("express");
const router = express.Router();
const pool = require("../conexion/pg");

var ubicacion = {};
router.get(
  "/registro",
  (async = (req, res) => {
    res.render("./registro/pais", ubicacion);
  })
);
router.post("/registro", async =(req, res) => {
  const { persona, pais, geometria, poblacion } = req.body;
  console.log(req.body);
  try {
    const await = pool.query(
      `insert into ubicacion(id,nombre_persona,nombre_pais,geometria,poblacion)values(1,'${persona}','${pais}','${geometria}','${poblacion}')`
    );
  } catch (ex) {
    console.log("Error " + ex);
  }
});
router.post("/formulario", (req, res) => {
  const { pais, poblacion, geometria } = req.body;
  ubicacion = {
    pais,
    poblacion,
    geometria,
  };
  console.log(req.body);
  res.send("datos enviados");
});
module.exports = router;
