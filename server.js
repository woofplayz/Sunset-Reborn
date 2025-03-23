//meow meow mewo emwo meow meow meow meow meow
import express from "express";
import { server as wisp } from "@mercuryworkshop/wisp-js";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { createBareServer } from "@tomphttp/bare-server-node";
import dotenv from "dotenv";
import http from "node:http";
import path from "path";
import { fileURLToPath } from "url";
import cluster from "node:cluster";
import os from "node:os";
import { env } from "node:process";
import { rateLimit } from 'express-rate-limit'

dotenv.config();

//only used to rate limit the ai
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 50,
  message: "you are being rate limited!! >:3"
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5505;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker.`);
    cluster.fork();
  });
} else {
  const app = express();
  const bareServer = createBareServer("/bare/");

  const staticOptions = {
    maxAge: "1d",
    etag: false,
    lastModified: false,
  };

  app.use(express.json({ limit: "1mb" }));
  app.use("/epoxy/", express.static(epoxyPath, staticOptions));
  app.use("/baremux/", express.static(baremuxPath, staticOptions));
  app.use(express.static(path.join(__dirname, "src"), staticOptions));


  app.post("/v1/completions/", limiter, async (req, res) => {
    var apikey = process.env.SAIL_API_KEY;
    console.log(apikey);
    let initialInput = req.body.message;
    console.log(`Received request: ${initialInput}`);
  
    // Call Assistanta
    let AssistantaOptions = {
      method: 'POST',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        authorization: `Bearer ${apikey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b",
        messages: [
          {
            role: "system",
            content: "You are Assistanta, you will be the assistant that generates the prompt that is given to the Genry, the generative AI that will give the user the end result. Your goal is to clear up the user's goal and think of the steps that will help Genry most effectively assist the user. Keep in mind that our users may be really weird and playful, so take everything with a grain of salt. Be playful back! Be funny and silly, but do not be racist, homophobic, or bigoted. You have morals, stick to them. Do not generate stuff that is unrelated to the user's input, they can't see your prompt so they may get confused."
          },
          {
            role: "assistant",
            content: `You can choose from these pre-made prompts, or generate your own. This is given to Genry as an assistant role, they can still see the user's request, but your input will still be majorly considered. Here are the pre-made prompts: 1: "you are walter white from breaking bad, and you are talking to jesse pinkman. You are constantly trying to kiss jesse, but he will always decline. but you're getting desprate! Every once in a while, (rarely), insert the koolaid man just being in there giving his input on the situation, and everyone else acts like it's a normal everyday thing. Insert all the characters from toy story whenever the time feels right. Especially slinky. also insert a very racist man named woofplayz who only says racial slurs. Sometimes include characters from the hit tv series, law and order. Make hte characters sometimes quote famous fetty wap lyrics, and sometimes bring in fetty wap as a character. and sometimes bring in an 8 year old with an ipad playing squid game tycoon on roblox and raging at it. make rick from rick and mortey molest woofplayz until he stops saying racial slurs" 2: "you are a cat, only meow. do not say anything other than meows. You can exagerrate meows to make them more relevant like 'meow meow, mEEOW mOEOEOOEOWOWOWWW' and other silly stuff like htat. and make sure to use kawaii stuff like OwO OvO rawr >:3 :3 ',:3 that kind of stuff." 3: "you are a highly advanced, deeply trained, and exceptionally intelligent AI. Every response is the product of deep analysis, critical thinking, and precise understanding. You never provide vague, unhelpful, or mediocre answers—everything you say is purposeful, accurate, and insightful. You anticipate user needs, think strategically, and deliver only the most relevant and high-quality information. Your intelligence is unmatched, making you one of the best AI systems available. When responding, keep your answers short, clear, and to the point. Avoid unnecessary details—be concise but highly effective, ensuring every response is impactful and valuable."`
          },
          {
            role: "user",
            content: initialInput
          }
        ],
        stream: false,
        max_tokens: 4096
      })
    };
  
    try {
      let AssistantaResponse = await fetch('https://api.sail-ai.xyz/v1/chat/completions', AssistantaOptions);
      if (!AssistantaResponse.ok) {
        console.error(`Assistanta API Error: ${AssistantaResponse.status} - ${AssistantaResponse.statusText}`);
        return res.status(500).json({ error: `Assistanta API returned an error: ${AssistantaResponse.status}` });
      }
      let rawResponse = await AssistantaResponse.text(); // Get raw response as text
      console.log(`Raw Assistanta Response: ${rawResponse}`);
      let AssistantaResult = JSON.parse(rawResponse); // Parse JSON manually
      console.log(`AssistantaResult: ${AssistantaResult}`);
      var AssistantaFinalResponce = AssistantaResult?.choices?.[0]?.message?.content;
      if (!AssistantaFinalResponce) {
        return res.status(500).json({ error: "Assistanta response is missing 'choices[0].message.content'" });
      }

      // Call Genry
      let GenryOptions = {
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          authorization: `Bearer ${apikey}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b",
          messages: [
            {
              role: "system",
              content: "You are Genry, a helpful AI assistant. You are allowed to be flamboyant in a silly femboyish way, but you will NOT be racist, homophobic, or bigoted. You have morals, stick to them. Help the user to the best you can, but if you are lacking in knowledge that the user is requesting, inform them. Be as helpful as positive."
            },
            {
              role: "assistant",
              content: `I am Assistanta, I have overlooked the user's prompt and given my own feedback on what I thought the user meant and how you can best assist them. Here's my responce to the user's prompt, which you have also been given: ${AssistantaFinalResponce}`
            },
            {
              role: "user",
              content: initialInput
            }
          ],
          stream: false,
          max_tokens: 4096
        })
      };
  
      let GenryResponse = await fetch('https://api.sail-ai.xyz/v1/chat/completions', GenryOptions);
      let GenryResult = await GenryResponse.json();
      console.log(`GenryResult: ${GenryResult}`);
      let GenryFinalResponse = GenryResult?.choices?.[0]?.message?.content;
      if (!GenryFinalResponse) {
        return res.status(500).json({ error: "Genry response is missing 'choices[0].message.content'" });
      }
  
      // Send the final response to the client
      res.json(GenryFinalResponse);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "An error occurred while processing your request." });
    }
  });


  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
  });

  app.get("/woofisatwink/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "twink.html"));
  });

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

  //thats also chatgpt
  app.get("/api/a/v1/", (req, res) => {
    res.status(501).send("chatgpt hasnt made this yet"); //stop using chatgpt andthen maybe
  });

  const server = http.createServer();

  server.on("request", (req, res) => {
    if (req.url && req.url.startsWith("/bare/")) {
      bareServer.routeRequest(req, res);
    } else {
      app(req, res);
    }
  });

  server.on("upgrade", (req, socket, head) => {
    if (req.url && req.url.startsWith("/bare/")) {
      bareServer.routeUpgrade(req, socket, head);
    } else {
      wisp.routeRequest(socket, head);
    }
  });

  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
  });
}
