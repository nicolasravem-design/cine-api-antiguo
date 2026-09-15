// Proyecto: sistema backend para la venta de peliculas
// Tecnologias: Node.js + Express + JWT + bcrypt

require('dotenv').config();
const express = require('express');

const rutasUsuarios = require('./rutas/usuarios');
const rutasPeliculas = require('./rutas/peliculas');
const { crearAdministrador } = require('./db');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Permite recibir datos en formato JSON
app.use(express.json());

// Ruta de inicio, muestra las rutas disponibles
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de peliculas',
    rutas: {
      'POST /usuarios/registro': 'Crear un usuario',
      'POST /usuarios/login': 'Iniciar sesion y obtener el token',
      'GET /usuarios/perfil': 'Ver la informacion del usuario que inicio sesion',
      'POST /peliculas': 'Crear una pelicula (solo administrador)',
      'GET /peliculas': 'Ver todas las peliculas (con sesion iniciada)',
      'GET /peliculas/buscar?anio=2000&precio=45000': 'Buscar por anio y precio (con sesion iniciada)'
    }
  });
});

app.use('/usuarios', rutasUsuarios);
app.use('/peliculas', rutasPeliculas);

// Si la ruta no existe
app.use((req, res) => {
  res.status(404).json({ mensaje: 'La ruta que busca no existe.' });
});

// Se crea el administrador y despues se enciende el servidor
crearAdministrador().then(() => {
  app.listen(PUERTO, () => {
    console.log('Servidor funcionando en http://localhost:' + PUERTO);
  });
});
