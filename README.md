# Proyecto Remisería

Bienvenido! En este proyecto presento una aplicación web simple para gestionar choferes, autos y viajes de una remisería utilizando frontend en NextJS y backend en ExpressJS por separado.

**El proyecto y este readme aún no están terminados**

## Deploy 🚀

[https://proyecto-remiseria.vercel.app](https://proyecto-remiseria.vercel.app)

Considera que el servidor gratuito donde alojo el backend se suspende por inactividad, por lo tanto es normal que al principio te responda lento

## Instalación frontend 🛠️

Párate en la carpeta [frontend](./frontend) y ejecuta el siguiente comando para instalar las dependencias

```bash
npm install
```

Es necesario crear variables de entorno mediante la elaboración de un archivo `.env.local` al mismo nivel que la carpeta src. Este archivo debe completarse con los siguientes campos, los cuales deben modificarse con tus propias credenciales en lugar del valor "X".

```env
NEXT_PUBLIC_URL_BACKEND = X # URL de tu backend sin barra lateral final

NEXT_PUBLIC_ACCESS_TOKEN = X # Cadena de caracteres utilizado como mecanismo de autenticación para asegurar que solamente los usuarios que presenten este token en los encabezados de sus solicitudes puedan acceder al backend. Importante: Su valor tiene que ser el mismo que el de la variable de entorno ACCESS_TOKEN que ponés en el backend
```

Corre el proyecto con el comando

```bash
npm run dev
```

Asegúrate de que la parte backend esté ejecutándose

## Instalación backend 🛠️

Párate en la carpeta [backend](./backend) y ejecuta el siguiente comando para instalar las dependencias

```bash
npm install
```

Al igual que el frontend, se necesitan variables de entorno, pero esta vez se deben colocar en un archivo `.env`. Estas son:

```env
URL_FRONTEND = X # URL de tu frontend sin barra lateral final

ACCESS_TOKEN = X # Cadena de caracteres utilizado como mecanismo de autenticación para asegurar que solamente los usuarios que presenten este token en los encabezados de sus solicitudes puedan acceder al backend. Importante: Su valor tiene que ser el mismo que el de la variable de entorno ACCESS_TOKEN que ponés en el frontend

# Credenciales de mysql
MYSQL_HOST = X
MYSQL_USER = X
MYSQL_PORT = X
MYSQL_PASSWORD = X
MYSQL_DATABASE = X
```

Corre el proyecto con el comando

```bash
npm run dev
```

Una vez que veas los mensajes "Servidor escuchando en el puerto 8080" (puerto configurado por defecto), podrás comenzar a utilizarlo sin problemas.

## Autor ✒️

| <img src="https://avatars.githubusercontent.com/u/107259761?v=4" width=50>|
|:-:|
| **Alejandro Portaluppi** |
| <a href="https://github.com/Ale6100"><img src="https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white"/></a> <a href="https://www.linkedin.com/in/alejandro-portaluppi"><img src="https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white"/></a> |
