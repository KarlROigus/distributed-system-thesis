#!/bin/bash
set -e

echo "Stopping and removing containers..."
docker-compose down -v || true

echo "Removing all Docker containers..."
docker rm -f $(docker ps -aq) 2>/dev/null || true

echo "Removing all Docker images..."
docker rmi -f $(docker images -aq) 2>/dev/null || true

echo "Removing all Docker volumes..."
docker volume ls -q | xargs -r docker volume rm

echo "Removing build cache..."
docker builder prune -a -f

echo "Docker environment cleaned successfully!"

