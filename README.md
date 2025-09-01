Instalar dependencias con npm install.

Ejecutar el proyecto en modo desarrollo con npm run dev. Esto iniciará el servidor con recarga automática al hacer cambios.

Configurar un archivo .env en la raíz del proyecto con la URI de MongoDB y el puerto. Por ejemplo:
MONGO_URI=<tu_url>
PORT=3000

Nota: Para esta prueba, el acceso a la base de datos está habilitado desde cualquier origen.

Estructura del proyecto:

src/models/Usuario.js → Definición del modelo de usuario y esquema de la base de datos.

src/services/UsuarioService.js → Lógica de negocio y reglas para los usuarios.

src/controllers/UsuarioController.js → Rutas y manejo de peticiones HTTP.

src/index.js → Inicialización del servidor, conexión a MongoDB y montaje de rutas.

Notas importantes:

Actualmente el proyecto se subió completo incluyendo node_modules y .vscode. Normalmente se excluyen estas carpetas usando .gitignore, porque node_modules puede ser muy pesado y se regenera automáticamente con npm install, y los archivos de editor no son necesarios en el repositorio. Esto evita problemas de compatibilidad y acelera la clonación del proyecto.

Para desplegarlo en otra máquina o servidor: clonar el repositorio, ejecutar npm install, configurar el .env con la URI de MongoDB y el puerto, y ejecutar npm run dev.
