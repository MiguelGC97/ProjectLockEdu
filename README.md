<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/MiguelGC97/ProjectLockEdu/">
    <img src="images/logo.png" alt="Logo" width="100%" height="100%">
  </a>

  <h3 align="center">LockEDU - Panel de Administración: Proyecto Final de CFGS en Desarrollo de Aplicaciones Web</h3>

  <p align="center">
    <strong>Alumna:</strong> Sarah Caroline Soares
    <br />
    <br />

  </p>

  <p align="center">
    Como parte de mi proyecto final para la conclusión del ciclo formativo de Desarrollo de Aplicaciones Web, me enfoqué en la implementación y mejora del panel de administración para LockEDU, un sistema de gestión de armarios y reservas diseñado para el IES El Rincón. Mi contribución principal fue desarrollar y adaptar el panel de administración, incluyendo la lógica del frontend, la gestión de roles, y la implementación de funcionalidades clave como el modo claro/oscuro, el manejo de sesiones, y la protección de rutas.
    <br />
    <br />
    
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## Sobre el Proyecto

El panel de administración de LockEDU es una parte crítica del sistema, diseñado para gestionar usuarios, armarios, casillas y objetos almacenados en la base de datos. Mi trabajo consistió en adaptar y mejorar los CRUDs existentes en el backend para proporcionar una experiencia de usuario más robusta y segura en el frontend. Además, implementé funcionalidades avanzadas como:

- **Modo claro/oscuro**: Integré un sistema de temas que permite a los usuarios cambiar entre modo claro y oscuro según sus preferencias.
- **Login por sesión**: Reemplacé la autenticación basada en tokens por un sistema de sesiones más escalable y eficiente.
- **Axios con sesión**: Adapté la instancia de Axios para utilizar sesiones en lugar de tokens Bearer, mejorando la seguridad y la gestión de la autenticación.
- **Rutas protegidas**: Implementé un sistema de rutas protegidas para los tres roles principales: ADMIN, TEACHER y MANAGER -- asegurando que cada usuario solo acceda a las funcionalidades permitidas.
- **CRUDs y manejo de errores**: Desarrollé todos los CRUDs necesarios para la gestión de usuarios, armarios, casillas y objetos, incluyendo un manejo de errores personalizado.

### Funcionalidades Destacadas

#### Barra de Usuario y Actualización del Avatar

En el panel de administrador, implementé una barra de usuario que muestra el avatar del usuario logueado. Esta barra está sincronizada con el componente de usuarios, de modo que cuando se actualiza el avatar de un usuario, la barra de usuario también se actualiza automáticamente. Para lograr esto, desarrollé una lógica basada en el contexto del usuario logueado (`logged user context`) que reinicia la sesión con los nuevos datos, los guarda y envía el usuario actualizado al frontend como parte de la respuesta. Esto asegura que el estado global de la aplicación se mantenga consistente sin afectar a otros usuarios.

#### Integración de Multer para la Gestión de Imágenes

Integré **Multer** en el proyecto para manejar la subida y eliminación de imágenes. Esta funcionalidad no existía previamente en el proyecto. Las características clave incluyen:

- **Middleware de eliminación**: Un middleware que se encarga de eliminar las imágenes de la carpeta `uploads` en dos situaciones:
  1. Al cerrar el servidor, se eliminan todas las imágenes temporales.
  2. Al actualizar la imagen de un usuario o casilla, se elimina la imagen anterior para evitar acumulación de archivos innecesarios.
- **Eliminación de imágenes en CRUDs**: Al eliminar un usuario o una casilla, también se elimina su imagen asociada de la base de datos y del sistema de archivos, si existe.

#### CRUDs con Modales y Categorías de Objetos

Todos los CRUDs fueron implementados utilizando modales para una experiencia de usuario más fluida. En el caso del CRUD de objetos, añadí la funcionalidad de seleccionar la categoría del objeto, la cual se basa en un listado predefinido en la tabla `types` de la base de datos. Esto permite una organización más eficiente de los objetos almacenados en los armarios.

[![LockEDU Panel de Administración][admin-dash]](https://github.com/MiguelGC97/ProjectLockEdu)

<p align="right">(<a href="#readme-top">volver al inicio</a>)</p>

### Construido Con

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

- [![React][React.js]][React-url]
- [![Node.js][Node.js]][Node-url]
- [![Sequelize][Sequelize.org]][Sequelize-url]
- [![MySQL][Mysql.com]][Mysql-url]
- [![Mantine][Mantine.dev]][Mantine-url]
- [![EJS][Ejs.dev]][Ejs-url]

<p align="right">(<a href="#readme-top">volver al inicio</a>)</p>

<!-- GETTING STARTED -->

## Empezando

Sigue estos pasos para configurar el proyecto localmente.

### Prerrequisitos

- npm
- Node.js
- MySQL Workbench
- Un navegador web moderno

### Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/MiguelGC97/ProjectLockEdu/
   ```
2. Instala las dependencias para el backend y el frontend:
   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. Adapta los archivos `.env.example` en las carpetas `backend` y `frontend` con las variables de entorno necesarias en un nuevo archivo `.env`
4. Crea una base de datos en MySQL Workbench con el nombre especificado en tu `.env`.
5. Ejecuta el backend:
   ```sh
   cd backend
   node index.js
   ```
6. Ejecuta el frontend:
   ```sh
   cd ../frontend
   npm run dev
   ```
7. ¡Listo! El panel de administración estará disponible en tu navegador, con las siguientes credentiales:

- <strong>correo eletrónico:</strong> yamihg@gmail.com
- <strong>contraseña:</strong> test1234

<p align="right">(<a href="#readme-top">volver al inicio</a>)</p>

<!-- LICENSE -->

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE.txt` para más información.

<p align="right">(<a href="#readme-top">volver al inicio</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Agradecimientos

- [Plantilla de README por othneildrew](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">volver al inicio</a>)</p>

[admin-dash]: images/app-admin.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Node.js]: https://img.shields.io/badge/Node.js-303030?style=for-the-badge&logo=node.js&logoColor=3C873A
[Node-url]: https://nodejs.org/
[Sequelize.org]: https://img.shields.io/badge/Sequelize-2379bd?style=for-the-badge&logo=sequelize&logoColor=#2379bd
[Sequelize-url]: https://sequelize.org/
[Mysql.com]: https://img.shields.io/badge/MySQL-DADADA?style=for-the-badge&logo=mysql&logoColor=00758F
[Mysql-url]: https://mysql.com
[Mantine.dev]: https://img.shields.io/badge/Mantine-cbe7f7?style=for-the-badge&logo=mantine&logoColor=309BF0
[Mantine-url]: https://mantine.dev
[Ejs.dev]: https://img.shields.io/badge/ejs-B4CA65?style=for-the-badge&logo=ejs&logoColor=A91E50
[Ejs-url]: https://ejs.co/
