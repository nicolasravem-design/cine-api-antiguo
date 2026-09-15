// Middlewares para proteger las rutas.

const jwt = require('jsonwebtoken');

const CLAVE_SECRETA = process.env.JWT_SECRET || 'claveSecretaDelProyecto';

// Revisa que el usuario haya iniciado sesion.
// El token se envia en el header:  Authorization: Bearer <token>
function verificarToken(req, res, next) {
  const autorizacion = req.headers.authorization;

  if (!autorizacion) {
    return res.status(401).json({
      mensaje: 'No ha iniciado sesion. Debe enviar el token en el header Authorization.'
    });
  }

  const token = autorizacion.split(' ')[1];

  try {
    const datosDelToken = jwt.verify(token, CLAVE_SECRETA);
    req.usuario = datosDelToken; // guardamos el usuario para usarlo en las rutas
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'El token no es valido o ya expiro.' });
  }
}

// Revisa que el usuario que inicio sesion sea administrador.
// Siempre se usa despues de verificarToken.
function verificarAdministrador(req, res, next) {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({
      mensaje: 'No esta autorizado para realizar esta accion. Solo el administrador puede crear peliculas.'
    });
  }

  next();
}

module.exports = { verificarToken, verificarAdministrador, CLAVE_SECRETA };
