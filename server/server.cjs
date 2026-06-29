// server.cjs
const hp = require("@hocuspocus/server");
const http = require("node:http");

const ServerClass = hp.Server || hp.Hocuspocus || (hp.default && hp.default.Server);
const PORT = parseInt(process.env.PORT || "1234", 10);

async function launch() {
  try {
    let server = ServerClass.configure
      ? ServerClass.configure({ port: PORT })
      : new ServerClass({ port: PORT });

    if (server instanceof Promise) server = await server;

    // Patch a /health route if the internal httpServer is accessible
    if (server.httpServer) {
      server.httpServer.on("request", (req, res) => {
        if (req.url === "/health") {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("OK");
        }
      });
    }

    if (typeof server.listen === "function") {
      await server.listen();
    } else if (typeof server.start === "function") {
      await server.start();
    }

    console.log(`🚀 SyncPad running on ws://0.0.0.0:${PORT}`);
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

launch();
