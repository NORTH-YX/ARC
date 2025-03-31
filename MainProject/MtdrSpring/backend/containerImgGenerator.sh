#!/bin/bash

# Stop and remove the container if it's running
docker stop agilecontainer 2>/dev/null
docker rm -f agilecontainer 2>/dev/null

# Remove old image
docker rmi arcproject 2>/dev/null

# Run Maven build
mvn verify

# Build Docker image for correct platform
docker build -f Dockerfile --platform linux/amd64 -t arcproject .

# Run the container
docker run -d --name agilecontainer -p 8080:8080 arcproject