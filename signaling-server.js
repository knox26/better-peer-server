// Simple WebSocket-based signaling server for better-peer

function startSignalingServer(options = {}) {
  const WebSocket = require('ws');
  const PORT = options.port || process.env.PORT || 3000;
  const wss = new WebSocket.Server({ port: PORT });
  const peers = new Map();

  wss.on('connection', (ws) => {
    let peerId = null;
    ws.isAlive = true;
    ws.on('pong', function heartbeat() { this.isAlive = true; });

    console.log('[better-peer:Server] New WebSocket connection');

    ws.on('message', (message) => {
      console.log(`[better-peer:Server] Message received: ${message}`);
      try {
        const data = JSON.parse(message);
        if (data.type === 'register') {
          peerId = data.peerId;
          peers.set(peerId, ws);
          ws.send(JSON.stringify({ type: 'registered', peerId }));
          console.log(`[better-peer:Server] Peer registered: ${peerId}`);
        } else if (data.type === 'signal' && data.target) {
          const targetWs = peers.get(data.target);
          if (targetWs) {
            targetWs.send(JSON.stringify({
              type: 'signal',
              from: peerId,
              signal: data.signal
            }));
            console.log(`[better-peer:Server] Signal relayed from ${peerId} to ${data.target}`);
          }
        }
      } catch (e) {
        ws.send(JSON.stringify({ type: 'error', message: `[better-peer:Server] ${e.message}` }));
        console.error(`[better-peer:Server] Error handling message: ${e.message}`);
      }
    });

    ws.on('close', () => {
      if (peerId) {
        peers.delete(peerId);
        console.log(`[better-peer:Server] Peer disconnected: ${peerId}`);
      } else {
        console.log('[better-peer:Server] WebSocket closed (unregistered peer)');
      }
    });
  });

  // Heartbeat for stale connection cleanup
  const PEER_TIMEOUT = 60 * 1000;
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, PEER_TIMEOUT / 2);

  console.log(`Signaling server running on ws://localhost:${PORT}`);
  return wss;
}

if (require.main === module) {
  startSignalingServer();
}

module.exports = { startSignalingServer };
