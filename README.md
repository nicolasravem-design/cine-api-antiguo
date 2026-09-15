# API de peliculas

Trabajo de backend hecho con Node.js y Express.

La API maneja usuarios con dos roles (administrador y basico) y un listado de
peliculas para la venta.

## Como ejecutarlo

Instalar las dependencias:

```
npm install
```

Encender el servidor:

```
npm start
```

Queda corriendo en http://localhost:3000

Al arrancar se crea solo un usuario administrador para poder probar:

- usuario: admin
- password: admin123

## Rutas

- `POST /usuarios/registro` - crear un usuario (username, password, rol)
- `POST /usuarios/login` - iniciar sesion, devuelve el token
- `GET /usuarios/perfil` - ver la informacion del usuario
- `POST /peliculas` - crear una pelicula (solo el administrador)
- `GET /peliculas` - ver todas las peliculas (estando logueado)
- `GET /peliculas/buscar?anio=2000&precio=45000` - buscar (estando logueado)

En las rutas que piden sesion hay que mandar el token en el header:

```
Authorization: Bearer el_token
```

## Los puntos del trabajo

**Punto 1.** El usuario se crea en `/usuarios/registro` con username, password y
rol. Si no mandan el rol queda como basico. La contraseña no se guarda tal cual,
se encripta con bcrypt y tampoco se devuelve en las respuestas. En `/usuarios/login`
se compara con bcrypt y si esta bien devuelve un token de JWT. En `/usuarios/perfil`
se consulta la informacion del usuario.

**Punto 2.** `POST /peliculas` recibe titulo, director, anioLanzamiento, productora
y precio. Tiene dos middlewares, uno revisa el token y el otro revisa que el rol sea
administrador. Si es un usuario basico responde error 403 diciendo que no esta
autorizado.

**Punto 3.** `GET /peliculas` devuelve todas las peliculas. Sirve para los dos roles
pero solo si iniciaron sesion, si no mandan el token da error 401.

**Punto 4.** `GET /peliculas/buscar` recibe dos parametros y devuelve las peliculas
con el anio mayor al primero y el precio menor o igual al segundo. Se hace con
filter() y tambien pide token.

## Archivos

- `index.js` - enciende el servidor
- `db.js` - los arreglos de usuarios y peliculas
- `middlewares/auth.js` - revisa el token y el rol
- `rutas/usuarios.js` - punto 1
- `rutas/peliculas.js` - puntos 2, 3 y 4
- `peticiones.http` - ejemplos para probar

## Notas

Los datos se guardan en arreglos dentro del codigo, o sea que se borran cada vez
que se reinicia el servidor. No use base de datos porque el trabajo no la pedia.

Para probar se puede usar Postman o el archivo `peticiones.http`.
