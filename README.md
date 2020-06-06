# Overwiki

A minimal, streamlined Wikipedia-like web application.

There are two ways to run this application for development:

1. Using Docker Compose to provision and manage application-related containers
2. Self-managing dependencies and servers

## Developer Setup (Docker Compose)

These instructions assume that you have Docker Compose installed. You can install with the instructions [here](https://docs.docker.com/compose/install/#install-compose). For most platforms Docker Compose comes bundled with Docker and the installation process is quick and easy.

From inside the Overwiki project directory run:

```bash
docker-compose up
```

This will spin up the following three services:

- React-based client application
- Express-based server application
- MongoDB server

Once these services are started, you can access the client from you web browser at `http://localhost:3030` and the server at `http://localhost:3000`.

You can run one-off commands on each service using `docker-compose run` (to start a container and run _only_ that command) or `docker-compose exec` (to execute a command on an already running server). E.g.,

```bash
docker-compose run server npm test
```

To learn more about available commands, see the [Docker Compose documentation](https://docs.docker.com/compose/reference/).

## Developer Setup (Self-Managed)

### 1. Install Node and NPM

Overwiki requires Node >= 12.13.0 and NPM >= 6.12.0. To install, see the official [downloads and documentation](https://nodejs.org/en/).

### 2. Install MongoDB

Overwiki requires MongoDB Community Edition >= 4.2.0.

#### Installing with Homebrew

_Recommended for users who do not need to manage multiple instances of MongoDB_

To install using [Homebrew](https://brew.sh/):

```
brew tap mongodb/brew
brew install mongodb-community@4.2
```

This will automatically create a configuration file and corresponding log and data directories managed by Homebrew (see [the official docs](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#procedure) for more detail).

#### Installing using M Version Manager

To install using the third-party [m version manager](https://github.com/aheckmann/m):

```
npm install -global m
m 4.2
```

Then create the default directories expected by MongoDB:

```
sudo mkdir /data/db
sudo mkdir /data/log
```

Alternatively, you can create a MongoDB [configuration file](https://docs.mongodb.com/manual/reference/configuration-options/) and manage your own data and log paths.

### 3. Install Dependencies

```
cd server && npm install
cd client && npm install
```

## Common Tasks

### Start MongoDB

#### Using Homebrew (as a macOS service)

```
brew services start mongodb-community@4.2
```

#### From the Terminal (as a process)

Start the `mongod` process, optionally providing a path for logging (the default behavior will log to standard output), and providing the port `27030`:

```
mongod --logpath /data/log --port 27030
```

Alternatively, provide the path to a configuration file:

```
mongod --config <filename>
```
