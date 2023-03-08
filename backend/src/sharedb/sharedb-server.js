import http from "http";
import express from "express";
import sharedb from "sharedb";
import WebSocket from "ws";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import "dotenv";

const db = new sharedb();
const host = "localhost:8080";
createDoc(startServer);

function createDoc(callback) {
  const connection = db.connect();
  const doc = connection.get("code", "codearea");
  doc.fetch(function (err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create({ content: "" }, callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // const wss = new WebSocket({ noServer: true });
  const wss = new WebSocket(`ws://${host}`);

  wss.on("connection", function connection(ws) {
    const stream = new WebSocketJSONStream(ws);
    db.listen(stream);
  });

  console.log("ws is on");
}
