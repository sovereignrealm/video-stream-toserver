"use strict";
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const WebSocket = require('ws');
const rateLimit = require("express-rate-limit");
const app = express();
const cors = require('cors');
const server = require('http').Server(app)
const basicAuth = require("./middlewares/basicAuth");
const isVideo = require("./utils/utils");

app.set('view engine', 'ejs')
app.use(express.static('public'))

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // start blocking after 5 requests
  message:
    "Too many requests from this IP"
});
app.use(cors());

app.get('/', authLimiter, basicAuth, (req, res) => {
  res.render('room', { wsUrl: process.env.WS_URL, wsAuth: process.env.WS_AUTH });
})

app.get('/status', (req, res) => {
  res.status(200).end();
})

app.use("/", (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(404).send(Buffer.from("<h1>Not found </h1>"));
})

const { PORT } = process.env;
const port = PORT || 3000;
server.listen(port, () => {
  console.log("Server running on port: ", port);
});
const wss = new WebSocket.Server({ server: server, path: "/streaming" });
// goes inside connection evey time user clicks on Start btn:
wss.on('connection', (ws, req) => {
  if (req.headers["sec-websocket-protocol"] !== process.env.WS_AUTH) return;
  const folder = path.join(__dirname, 'videos');
  const fileName = "VID_" + moment().format('YYYYMMDD_HH-mm-ss') + ".mp4";
  const filePath = folder + "/" + fileName;
  const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
  let isFirstChunk = true;
  ws.on('message', message => {
    if (isFirstChunk && isVideo(message)) {
      fileStream.write(Buffer.from(new Uint8Array(message)));
      isFirstChunk = false;
    } else if (!isFirstChunk) {
      fileStream.write(Buffer.from(new Uint8Array(message)));
    }
  });
});