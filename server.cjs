const { Server } = require("@hocuspocus/server");

const server = new Server({
  // Use Render's dynamically assigned PORT, or fallback to 1234 locally
  port: process.env.PORT ? Number(process.env.PORT) : 1234,
  // Add this to your server.cjs
  server.app.get("/health", (req, res) => {
  res.status(200).send("OK");
  });
});

server.listen();
