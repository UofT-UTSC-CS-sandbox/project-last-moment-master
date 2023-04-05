const ShareDBMongo = require("sharedb-mongo");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ShareDB = require("sharedb");

dotenv.config();

const db = new ShareDBMongo(process.env.MONGODB_CONNECTION);
const backend = new ShareDB({ db });
const connection = backend.connect();

const createDoc = (roomId, callback) => {
  const doc = connection.get("coderooms", roomId);
  doc.fetch(function (err) {
    if (err) throw err;
    if (doc.type === null || doc.data === undefined) {
      doc.create([{ content: [] }], callback);
      return;
    }
    callback();
  });
};

const deleteDoc = async (roomId, callback) => {
  // const doc = connection.get(roomId, "textarea");
  const doc = connection.get("coderooms", roomId);
  doc.del();
  doc.submitOp([{p: "_delete"}]);
  // const conn = await mongoose
  //   .createConnection(process.env.MONGODB_CONNECTION)
  //   .asPromise();
  // await conn.dropCollection(`${roomId}`);
  // await conn.dropCollection(`o_${roomId}`);
  // await conn.close();
  return callback();
};

module.exports = { createDoc, deleteDoc };