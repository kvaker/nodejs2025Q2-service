# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

# Home Library API

📚 RESTful API for managing a personal home library. Built with NestJS + PostgreSQL + TypeORM + Docker.

---

## Features

User, Artist, Album, Track, and Favorites management

PostgreSQL with TypeORM

Auto-restart containers on failure

Migrations for DB schema

Live-reloading in development

Docker image size < 500MB

Secure image auditing

Volume-based persistent storage

DockerHub publishing

## Running application

```
docker-compose up --build
API available at: http://localhost:4000

```

## Database Migrations

1. Generate Migration

```
docker-compose run --rm migration
```

This generates a migration file in src/migrations/. 2. Run Migrations

```
npm run migration:run
```

## Security Audit

Run audit inside the container:

```
docker-compose run --rm app npm audit
```

## Docker Image Management

Build image manually

```
docker build -t <your_dockerhub>/home-library-app .
```

Check image size

```
docker images
```

Goal: ≤ 500MB for production images

## Push to DockerHub

```
docker login
docker tag <local_image_id> <your_dockerhub>/home-library-app
docker push <your_dockerhub>/home-library-app
```

## Cleanup

Stop & remove containers + volumes

```
docker-compose down -v --remove-orphans
```

Remove unused images

```
docker image prune -f
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

<!--
To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging -->
