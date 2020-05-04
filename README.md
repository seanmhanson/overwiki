# Overwiki
A minimal, streamlined Wikipedia-like web application.

## Developer Setup
1. Install Node >= v12.13.0:
   - via [homebrew](https://brew.sh/) with the command `brew install node`
    - via the [nodejs installer](https://nodejs.org/en/)
2. Install NPM >= 6.12.0 (included with Node)
3. Install server dependencies:
```
cd server
npm install
```

## Common Tasks
### Start the server
```
cd server
npm run
```

### Lint all server files
(this will be included as a commit hook)
```
npm run lint
```

### Format all server files
(this will be included as a commit hook)
```
npm run format
```
