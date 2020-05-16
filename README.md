# Overwiki

A minimal, streamlined Wikipedia-like web application.

## Developer Setup

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
