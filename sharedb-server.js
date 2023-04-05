const http = require("http");
const express = require("express");
const ShareDB = require("sharedb");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const dotenv = require("dotenv");
const ShareDBMongo = require("sharedb-mongo");

dotenv.config();

const db = new ShareDBMongo(process.env.MONGODB_CONNECTION);
const backend = new ShareDB({ db });
const connection = backend.connect();

const port = process.env.API_PORT || 3002;

createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback) {
  var doc = connection.get("code", "textarea");

  doc.fetch(function (err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{ content: [] }], callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static("static"));
  var server = http.createServer(app);
  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({ server: server });
  wss.on("connection", function (ws) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(port, () =>
    console.log(`Sharedb Server listening on port ${port}`)
  );
}
