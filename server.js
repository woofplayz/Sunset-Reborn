import express from "express"
import { server as wisp } from "@mercuryworkshop/wisp-js";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { createBareServer } from '@tomphttp/bare-server-node';
import dotenv from 'dotenv';
import http from 'node:http';

dotenv.config();
const server = http.createServer();
const app = express();
const __dirname = process.cwd();
const PORT = 5505;
const bare = createBareServer('/bare/');
//https://en.wikipedia.org/wiki/Epoxy
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

app.use(express.static(__dirname + "/src"));

server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
      bare.routeRequest(req, res)
  } else {
      app(req, res)
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
      bare.routeUpgrade(req, socket, head)
  } else {
      wisp.routeRequest(socket, head);
  }
});


app.get("/", (req, res) => {
  res.sendFile("/src/index.html", { root: __dirname });
});


app.get("/api/a/v1/", (req, res) => {
  const message = req.query.body;
  const apiKey = process.dotenv.AI_API_KEY
  //send a request to the ai with the api key loaded from the env file

  
});

app.get("/woofisatwink/", (req, res) => {
  res.sendFile("/src/twink.html", { root: __dirname });
});

app.get("/api/icons/v1/", async (req, res) => {
  const url = req.query.url;

  let img = await fetch(`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`)
  const data = Buffer.from(await img.arrayBuffer())


  res.set("Content-Type", "image/jpeg");
  res.send(data);
});


server.listen(PORT);