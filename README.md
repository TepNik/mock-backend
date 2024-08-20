### Requirements

NodeJS and NPM.

### Install dependencies

```bash
npm install
```

### Run backend

Before running, a port of the backend can be changed from 3000 to any value in the code.

Also, there is a sleep time in the `/v1/nonce-manager/nonces` endpoint that simulates network latency. It can be configured too.

```bash
npm run start
```

### Endpoints

[localhost:3000/v1/nonce-manager/config](http://localhost:3000/v1/nonce-manager/config) (GET)

[localhost:3000/v1/nonce-manager/nonces](http://localhost:3000/v1/nonce-manager/nonces) (POST)
