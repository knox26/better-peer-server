# better-peer-server

A simple, pluggable WebRTC signaling server for use with the better-peer client library.

## Usage

### 1. As a Standalone Server (CLI)

```sh
npm install better-peer-server
node signaling-server.js
```

### 2. Programmatically in Your Node.js App (Attach to Existing HTTP Server)

```js
const express = require('express');
const http = require('http');
const { startSignalingServer } = require('better-peer-server');

const app = express();
const server = http.createServer(app);

// Attach signaling server to the same HTTP server (same port)
startSignalingServer({ server });

app.get('/', (req, res) => res.send('Hello from backend and signaling!'));

server.listen(3000, () => {
  console.log('Backend and signaling server running on http://localhost:3000');
});
```

## Features
- Minimal, fast, and easy to deploy
- Works out-of-the-box with [better-peer-client](https://github.com/yourusername/better-peer-client) client library
- Can be used as a standalone signaling server for any WebRTC project
- Can be attached to your existing HTTP server (Express, etc.) to share the same port

---

**Client Library**

This server is designed to work seamlessly with the [better-peer-client](https://github.com/yourusername/better-peer-client)  client library. See the [better-peer-client](https://github.com/yourusername/better-peer-client)  repo for usage examples and integration.
