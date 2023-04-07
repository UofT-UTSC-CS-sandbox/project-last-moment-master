const http = require("http");
const cors = require("cors");
const express = require("express");
const ShareDB = require("sharedb");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const dotenv = require("dotenv");
const ShareDBMongo = require("sharedb-mongo");
const https = require("https"),
  fs = require("fs");

const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = `https://skillvitrine.wlt.life`;
// const appOrigin = `https://skillvitrine.wlt.life:${appPort}`;

const options = {
  key: fs.readFileSync("../skillvitrine.wlt.life.key"),
  cert: fs.readFileSync("../skillvitrine.wlt.life_bundle.pem")
};

dotenv.config();

const db = new ShareDBMongo(process.env.MONGODB_CONNECTION);
const backend = new ShareDB({ db });
const connection = backend.connect();

const port = process.env.API_PORT || 3002;

// Create a web server to serve files and listen to WebSocket connections
var app = express();
app.use(cors({ origin: appOrigin }));
app.use(express.static("static"));
var server = https.createServer(options, app);

// Connect any incoming WebSocket connection to ShareDB
var wss = new WebSocket.Server({ server });
wss.on("connection", function (ws) {
  var stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

server.listen(port, () =>
  console.log(`Sharedb Server listening on port ${port}`)
);
