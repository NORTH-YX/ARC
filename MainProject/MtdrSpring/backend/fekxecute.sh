#!/bin/bash
set -e
set -x

echo "🛑 Stopping any running container..."
podman stop agilecontainer || echo "No container to stop"

echo "🧹 Removing old container..."
podman rm agilecontainer || echo "No container to remove"

echo "🧼 Removing old image..."
podman rmi arcproject || echo "No image to remove"

echo "🔨 Building project with Maven..."
mvn clean verify

echo "📦 Building Podman image..."
podman build -f Dockerfile --platform linux/amd64 -t arcproject .

echo "🚀 Running container on port 8080..."
podman run -d --name agilecontainer -p 8080:8080 arcproject

echo "✅ App is now running! Visit: http://localhost:8080"