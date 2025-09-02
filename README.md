Instalar dependencias con npm install.

Ejecutar el proyecto en modo desarrollo con npm run dev. Esto iniciará el servidor con recarga automática al hacer cambios.

Configurar un archivo .env en la raíz del proyecto con la URI de MongoDB y el puerto. 
Por ejemplo:
- MONGO_URI=<url_mia>
- PORT=3000

Para esta prueba, el acceso a la base de datos está habilitado desde cualquier origen.

- Estructura del proyecto:

   1.  index.js:

        Configura Express con cors y json.

        Conecta a MongoDB Atlas (mi_base_datos.usuarios).

        Monta las rutas de route.js.

        Arranca el servidor.

   2.  route.js:

        Define endpoints CRUD de usuarios:

        1. GET: http://localhost:3000 --> Mensaje de bienvenida.
        2. GET: http://localhost:3000/usuarios --> Obtienes todos los usuarios.
        3. GET: http://localhost:3000/usuarios?page=1&limit=5 --> Devuelve la primera página con 5 usuarios.
        4. GET: http://localhost:3000/usuarios?page=1&limit=5&q=Prue&sort=name --> Devuelve los nombres que empiezen por ... = ("Prue")
        5. POST: http://localhost:3000/usuarios --> Crear un usuario.
        6. GET: http://localhost:3000/usuarios/68b6af1266b0802ec6e6ad98 --> Obtener un usuario por id.
        7. PUT: http://localhost:3000/usuarios/68b6af1266b0802ec6e6ad98 --> Editar un usuario por id.
        8. DELETE: http://localhost:3000/usuarios/68b6af1266b0802ec6e6ad98 --> Eliminar usuario por id.
        9. GET: http://localhost:3000/usuarios/stats --> Obtener estadisticas.

