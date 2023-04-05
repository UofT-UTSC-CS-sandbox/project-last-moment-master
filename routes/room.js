const express = require("express");
const Room = require("../models/roomModel");
const { ObjectId } = require("mongodb");
const { createDoc, deleteDoc } = require("../models/sharedb");

const router = express.Router();

router.post("/create", async (req, res) => {
  const owner = req.body.owner;
  const _id = new ObjectId();
  if (!owner || owner === "") {
    console.error("Missing owner");
    return res.status(400).send("Missing owner");
  }
  createDoc(_id, async (err) => {
    if (err) {
      res.status(500).send("Sharedb room creation failed");
    }
    const room = new Room({
      owner: owner,
      _id: _id,
    });
    
    await room.save();
    return res.json(room.toObject());
  });
});

router.delete("/delete/:id", async (req, res) => {
  const owner = req.body.owner;
  const roomId = req.params.id;
  if (!roomId || roomId === "") {
    console.error("Missing room ID");
    return res.status(400).send("Missing room ID");
  }

  if (!ObjectId.isValid(roomId)) {
    console.error("Invalid room ID");
    return res.status(400).send("Invalid room ID");
  }

  const room = await Room.findOne({ _id: roomId });
  if (!room) {
    console.error("Room not found");
    return res.status(404).send("Room not found");
  }

  deleteDoc(roomId, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Sharedb room deletion failed");
    }
    await deleteOne({ _id: roomId });
    return res.json(room.toObject());
  });
});

//get a room by roonId
router.get("/:roomId", async (req, res) => {
  if (!req.params.roomId || req.params.roomId === "") {
    console.error("Missing room ID");
    return res.status(400).send("Missing room ID");
  }

  if (!ObjectId.isValid(req.params.roomId)) {
    console.error("Invalid room ID");
    return res.status(400).send("Invalid room ID");
  }

  const roomId = req.params.roomId;
  const room = await Room.findOne({ _id: roomId });

  if (!room) {
    console.error("Room not found");
    return res.status(404).send("Room not found");
  }
  return res.json(room.toObject());
});

//another user joins the room
router.patch("/join/:roomId", async (req, res) => {
  if (!req.params.roomId || req.params.roomId === "") {
    console.error("Missing room ID");
    return res.status(400).send("Missing room ID");
  }

  if (!ObjectId.isValid(req.params.roomId)) {
    console.error("Invalid room ID");
    return res.status(400).send("Invalid room ID");
  }

  const roomId = req.params.roomId;
  const user = req.body.user;

  // if (room.user === user) {
  //   console.error("User already in room");
  //   return res.status(400).send("User already in room");
  // }

  if (!user || user === "") {
    console.error("Missing user");
    return res.status(400).send("Missing user");
  }

  const room = await Room.findOne({ _id: roomId });

  if (!room) {
    console.error("Room not found");
    return res.status(404).send("Room not found");
  }

  if (room.user) {
    console.error("Room already occupied");
    return res.status(400).send("Room already occupied");
  }

  if (room.owner === user) {
    console.error("User is owner");
    return res.status(400).send("User is owner");
  }

  room.user = user;
  await room.save();
  return res.json(room.toObject());
});

//user leaves the room
router.patch("/leave/:roomId", async (req, res) => {
  if (!req.params.roomId || req.params.roomId === "") {
    console.error("Missing room ID");
    return res.status(400).send("Missing room ID");
  }

  if (!ObjectId.isValid(req.params.roomId)) {
    console.error("Invalid room ID");
    return res.status(400).send("Invalid room ID");
  }

  const roomId = req.params.roomId;
  const user = req.body.user;
  if (!user || user === "") {
    console.error("Missing user");
    return res.status(400).send("Missing user");
  }

  const room = await Room.findOne({ _id: roomId });
  if (!room) {
    console.error("Room not found");
    return res.status(404).send("Room not found");
  }

  if(room.owner === user) {
    room.owner, room.user = room.user, room.owner;
    room.user = null;
    await room.save();
    return res.json(room.toObject());
  }

  if (room.user !== user && room.owner !== user) {
    console.error("User not in room");
    return res.status(400).send("User not in room");
  }

  room.user = null;
  await room.save();
  return res.json(room.toObject());
});

module.exports = router;
