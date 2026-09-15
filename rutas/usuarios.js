// PUNTO 1: crear un usuario, autenticarlo y consultar su informacion.

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { usuarios } = require('../db');
const { verificarToken, CLAVE_SECRETA } = require('../middlewares/auth');

const router = express.Router();

// Registrar un usuario nuevo.
// El password se guarda encriptado con bcrypt, nunca en texto plano.
router.post('/registro', async (req, res) => {
  const { username, password, rol } = req.body;

  // Validaciones basicas
  if (!username || !password) {
    return res.status(400).json({ mensaje: 'Debe enviar username y password.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ mensaje: 'El password debe tener minimo 6 caracteres.' });
  }

  if (rol && rol !== 'administrador' && rol !== 'basico') {
    return res.status(400).json({ mensaje: 'El rol debe ser administrador o basico.' });
  }

  // Revisar que el username no exista
  const usuarioRepetido = usuarios.find(u => u.username === username);

  if (usuarioRepetido) {
    return res.status(400).json({ mensaje: 'Ese username ya esta registrado.' });
  }

  // Encriptar el password (hash)
  const passwordEncriptado = await bcrypt.hash(password, 10);

  const nuevoUsuario = {
    id: usuarios.length + 1,
    username: username,
    password: passwordEncriptado,
    rol: rol || 'basico' // si no envian rol, queda como usuario basico
  };

  usuarios.push(nuevoUsuario);

  // En la respuesta no se devuelve el password
  res.status(201).json({
    mensaje: 'Usuario creado correctamente.',
    usuario: {
      id: nuevoUsuario.id,
      username: nuevoUsuario.username,
      rol: nuevoUsuario.rol
    }
  });
});

// Iniciar sesion. Si los datos son correctos devuelve un token.
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ mensaje: 'Debe enviar username y password.' });
  }

  const usuario = usuarios.find(u => u.username === username);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Usuario o password incorrectos.' });
  }

  // Compara el password enviado con el hash guardado
  const passwordCorrecto = await bcrypt.compare(password, usuario.password);

  if (!passwordCorrecto) {
    return res.status(401).json({ mensaje: 'Usuario o password incorrectos.' });
  }

  // Se crea el token con los datos del usuario
  const token = jwt.sign(
    { id: usuario.id, username: usuario.username, rol: usuario.rol },
    CLAVE_SECRETA,
    { expiresIn: '2h' }
  );

  res.json({
    mensaje: 'Inicio de sesion exitoso.',
    token: token,
    usuario: {
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol
    }
  });
});

// Consultar la informacion del usuario que inicio sesion.
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    usuario: {
      id: req.usuario.id,
      username: req.usuario.username,
      rol: req.usuario.rol
    }
  });
});

module.exports = router;
