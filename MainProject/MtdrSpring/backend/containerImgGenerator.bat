docker stop agilecontainer
docker rm -f agilecontainer
docker rmi arcproject
call mvn verify
docker build -f Dockerfile --platform linux/amd64 -t arcproject .
docker run -d --name agilecontainer -p 8080:8080 arcproject