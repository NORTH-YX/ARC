docker stop agilecontainer
docker rm -f agilecontainer
docker rmi mx-queretaro-1.ocir.io/ax2fs7hibrfo/reacttodo/puebo/todolistapp-springboot:0.1
mvn verify
docker build -f Dockerfile --platform linux/amd64 -t mx-queretaro-1.ocir.io/ax2fs7hibrfo/reacttodo/puebo/todolistapp-springboot:0.1 .
docker run --name agilecontainer -p 8080:8080 -d mx-queretaro-1.ocir.io/ax2fs7hibrfo/reacttodo/puebo/todolistapp-springboot:0.1