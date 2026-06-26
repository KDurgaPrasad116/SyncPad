const { Server } = require("@hocuspocus/server");

const server = Server.configure({
  // Use Render's dynamically assigned PORT, or fallback to 1234 locally
  port: process.env.PORT || 1234,
});

server.listen();
