#!/bin/bash
# Stop and remove existing container
docker stop agilecontainer
docker rm -f agilecontainer

# Remove existing image
docker rmi arcproject

# Run Maven build
mvn verify

# Build the Docker image
docker build -f Dockerfile --platform linux/arm64 -t arcproject .

# Run the Docker container
docker run -d --name agilecontainer -p 8080:8080 arcproject

# Show logs in real time
docker logs -f agilecontainer