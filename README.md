# Proyecto Remisería

Bienvenido! En este proyecto presento una aplicación web simple para gestionar automóviles, choferes y viajes de una remisería utilizando frontend en NextJS y backend en ExpressJS por separado.

## Instalación frontend 🛠️

Luego de descargar el proyecto, posicionate sobre la carpeta [frontend](./frontend) y ejecuta el siguiente comando para instalar las dependencias

```bash
npm install
```

Es necesario crear variables de entorno mediante la elaboración de un archivo `.env.local` al mismo nivel que la carpeta src. Este archivo debe completarse con los siguientes campos, los cuales deben modificarse con tus propias credenciales en lugar del valor "X".

```env
NEXT_PUBLIC_URL_BACKEND = X # URL de tu backend sin barra lateral final

NEXT_PUBLIC_ACCESS_TOKEN = X # Bearer Token. Importante: Su valor tiene que ser el mismo que el de la variable de entorno ACCESS_TOKEN que ponés en el backend
```

Corre el proyecto con el comando

```bash
npm run dev
```

Asegúrate de que la parte backend esté ejecutándose. En la terminal figurará la URL de tu frontend listo para utilizar.

## Instalación backend 🛠️

Posicionate en la carpeta [backend](./backend) y ejecuta el siguiente comando para instalar las dependencias

```bash
npm install
```

Al igual que el frontend, se necesitan variables de entorno, pero esta vez se deben colocar en un archivo `.env`. Estas son:

```env
URL_FRONTEND = X # URL de tu frontend sin barra lateral final

ACCESS_TOKEN = X # Bearer Token. Importante: Su valor tiene que ser el mismo que el de la variable de entorno NEXT_PUBLIC_ACCESS_TOKEN que ponés en el frontend

# Credenciales de mysql
MYSQL_HOST = X
MYSQL_USER = X
MYSQL_PORT = X
MYSQL_PASSWORD = X
MYSQL_DATABASE = X
```

Asegúrate de que el valor que hayas puesto en MYSQL_DATABASE sea el nombre de una base de datos ya existente.

Si es la primera vez que levantas el proyecto necesitarás ejecutar los comandos del archivo [backend/src/config/createTables.sql](./backend/src/config/createTables.sql) para tener las tablas necesarias.

Una vez que hayas seguido estos pasos puedes correr el proyecto con el comando

```bash
npm run dev
```

Una vez que veas el mensaje "Servidor escuchando en el puerto 8080" (puerto configurado por defecto), podrás comenzar a utilizarlo sin problemas.

## Construido con 🛠️

* [NodeJS v20.15.1](https://nodejs.org/)
* [ExpressJs](https://expressjs.com/)
* [NextJs 14](https://nextjs.org/)
* [MySQL](https://www.mysql.com/)
* [ReactJS](https://reactjs.org/)
* [Tailwind](https://tailwindcss.com/)
* [cors](https://www.npmjs.com/package/cors)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [shadcn](https://ui.shadcn.com/)
* [sweetalert2](https://sweetalert2.github.io/)
* [winston](https://www.npmjs.com/package/winston)
* [moment-timezone](https://www.npmjs.com/package/moment-timezone)

## Autor ✒️

| <img src="https://avatars.githubusercontent.com/u/107259761?v=4" width=50>|
|:-:|
| **Alejandro Portaluppi** |
| <a href="https://github.com/Ale6100"><img src="https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white"/></a> <a href="https://www.linkedin.com/in/alejandro-portaluppi"><img src="https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white"/></a> |
