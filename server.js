const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { notificationWebSocket } = require('./lib/js/websocket');

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize WebSocket server
  notificationWebSocket.initialize(server);

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    // Server started (removed console.log for production)
  });
});