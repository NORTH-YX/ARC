# ARC
ORACLE JAVA BOT

Pasos para correr la app desde WINDOWS, MAC todavía no disponible

1- Clonar el repo

2- Descargar el zip de wallet y extraerlo en la carpeta de backend

3- Abrir docker

4- Abrir el proyecto en terminal, en la ruta de la carpeta de backend

5- Correr comando: cmd

6- Correr comando: containerImgGenerator.bat

7- Esperar a que todo se ejecute

Abrir localhost:8080 y esperar unos segundos, verifica si les corre el proyecto (Si ya funciona no hacer caso a lo siguiente)

NOTA

* Si no les corre hay que ejecutar manualmente en terminal lo siguiente:

docker build -f Dockerfile --platform linux/amd64 -t arcproject .

docker run -d --name agilecontainer -p 8080:8080 arcproject

* Volver a abrir localhost:8080

