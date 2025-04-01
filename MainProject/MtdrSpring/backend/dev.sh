#!/bin/bash

# Build the frontend
cd src/main/frontend
npm install
npm run build
cd ../../../

# Run the application with hot reloading
./mvnw spring-boot:run 