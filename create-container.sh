#!/bin/bash

set -e 

git pull 
docker compose up -d --build 

echo "BUILD COMPLETE"
echo "RUNNING..."
docker ps 