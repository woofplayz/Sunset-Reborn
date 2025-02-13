import express from "express";
import { server as wisp } from "@mercuryworkshop/wisp-js";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { createBareServer } from '@tomphttp/bare-server-node';
import dotenv from 'dotenv';
import http from 'node:http';
import path from 'path';
import { fileURLToPath } from 'url';
import cluster from 'node:cluster';
import os from 'node:os';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5505;
const numCPUs = os.cpus().length;

// Master process: fork a worker for each CPU
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker.`);
    cluster.fork();
  });
} else {
  // Worker process: set up the server
  const app = express();
  const bareServer = createBareServer('/bare/');

  // Optimize static file serving to make it faster
  const staticOptions = {
    maxAge: '1d',
    etag: false,
    lastModified: false,
  };

  app.use(express.json({ limit: '1mb' }));
  app.use("/epoxy/", express.static(epoxyPath, staticOptions));
  app.use("/baremux/", express.static(baremuxPath, staticOptions));
  app.use(express.static(path.join(__dirname, "src"), staticOptions));

  // HTML Routes
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
  });

  app.get("/woofisatwink/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "twink.html"));
  });

  // cache icons
  const iconCache = new Map();
  app.get("/api/icons/v1/", async (req, res) => {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send("Missing url parameter");
    }
    if (iconCache.has(url)) {
      res.set("Content-Type", "image/jpeg");
      return res.send(iconCache.get(url));
    }
    try {
      const response = await fetch(
        `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`
      );
      const data = Buffer.from(await response.arrayBuffer());
      iconCache.set(url, data);
      res.set("Content-Type", "image/jpeg");
      res.send(data);
    } catch (error) {
      console.error("Error fetching icon:", error);
      res.status(500).send("Error fetching icon");
    }
  });

  // API: AI endpoint (not implemented)
  app.get("/api/a/v1/", (req, res) => {
    // TODO: Implement AI request handling
    res.status(501).send("Not implemented");
  });

  const server = http.createServer();

  // Handle normal HTTP requests
  server.on('request', (req, res) => {
    // Fast check for bareServer routes (mounted on /bare/)
    if (req.url && req.url.startsWith('/bare/')) {
      bareServer.routeRequest(req, res);
    } else {
      app(req, res);
    }
  });

  // Handle upgrade requests (websocket or similar upgrades)
  server.on('upgrade', (req, socket, head) => {
    if (req.url && req.url.startsWith('/bare/')) {
      bareServer.routeUpgrade(req, socket, head);
    } else {
      wisp.routeRequest(socket, head);
    }
  });

  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
  });
}
