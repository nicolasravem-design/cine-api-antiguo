// Aqui se guardan los datos de la aplicacion.
// Se usan arreglos en memoria, por lo que la informacion se pierde
// cada vez que se reinicia el servidor.

const bcrypt = require('bcryptjs');

const usuarios = [];
const peliculas = [];

// Crea un usuario administrador al iniciar el programa,
// para poder probar la creacion de peliculas.
async function crearAdministrador() {
  const passwordEncriptado = await bcrypt.hash('admin123', 10);

  usuarios.push({
    id: 1,
    username: 'admin',
    password: passwordEncriptado,
    rol: 'administrador'
  });

  console.log('Usuario administrador creado -> username: admin / password: admin123');
}

module.exports = { usuarios, peliculas, crearAdministrador };
