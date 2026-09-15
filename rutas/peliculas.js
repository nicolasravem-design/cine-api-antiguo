// PUNTOS 2, 3 y 4: crear y consultar peliculas.

const express = require('express');

const { peliculas } = require('../db');
const { verificarToken, verificarAdministrador } = require('../middlewares/auth');

const router = express.Router();

// PUNTO 2: crear una pelicula.
// Solo puede hacerlo el administrador. Si es un usuario basico,
// el middleware verificarAdministrador responde con error 403.
router.post('/', verificarToken, verificarAdministrador, (req, res) => {
  const { titulo, director, anioLanzamiento, productora, precio } = req.body;

  // Validaciones de los datos de la pelicula
  if (!titulo || !director || !anioLanzamiento || !productora || precio === undefined) {
    return res.status(400).json({
      mensaje: 'Debe enviar titulo, director, anioLanzamiento, productora y precio.'
    });
  }

  if (isNaN(anioLanzamiento) || isNaN(precio)) {
    return res.status(400).json({ mensaje: 'El anioLanzamiento y el precio deben ser numeros.' });
  }

  if (precio < 0) {
    return res.status(400).json({ mensaje: 'El precio no puede ser negativo.' });
  }

  const nuevaPelicula = {
    id: peliculas.length + 1,
    titulo: titulo,
    director: director,
    anioLanzamiento: Number(anioLanzamiento),
    productora: productora,
    precio: Number(precio)
  };

  peliculas.push(nuevaPelicula);

  res.status(201).json({
    mensaje: 'Pelicula creada correctamente.',
    pelicula: nuevaPelicula
  });
});

// PUNTO 4: consultar las peliculas con anio de lanzamiento MAYOR a un valor
// y precio MENOR O IGUAL a otro valor. Los dos llegan por parametro.
// Ejemplo: /peliculas/buscar?anio=2000&precio=45000
// Esta ruta va antes que las demas para que no se confunda con otra.
router.get('/buscar', verificarToken, (req, res) => {
  const { anio, precio } = req.query;

  if (!anio || !precio) {
    return res.status(400).json({
      mensaje: 'Debe enviar los parametros anio y precio. Ejemplo: /peliculas/buscar?anio=2000&precio=45000'
    });
  }

  if (isNaN(anio) || isNaN(precio)) {
    return res.status(400).json({ mensaje: 'Los parametros anio y precio deben ser numeros.' });
  }

  const anioBuscado = Number(anio);
  const precioBuscado = Number(precio);

  const resultado = peliculas.filter(function (pelicula) {
    return pelicula.anioLanzamiento > anioBuscado && pelicula.precio <= precioBuscado;
  });

  res.json({
    mensaje: 'Peliculas con anio mayor a ' + anioBuscado + ' y precio menor o igual a ' + precioBuscado,
    total: resultado.length,
    peliculas: resultado
  });
});

// PUNTO 3: consultar todas las peliculas.
// Lo puede hacer el administrador y el usuario basico,
// pero solamente si han iniciado sesion (por eso lleva verificarToken).
router.get('/', verificarToken, (req, res) => {
  res.json({
    total: peliculas.length,
    peliculas: peliculas
  });
});

module.exports = router;
