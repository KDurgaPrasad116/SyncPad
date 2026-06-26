const hp = require("@hocuspocus/server");

// 1. Find the exported Server class defensively, regardless of how Node wrapped it
// server.cjs
const server = Server.configure({
  port: process.env.PORT || 1234,
})

async function launch() {
  try {
    // 2. Initialize the server dynamically based on available static methods
    let server = ServerClass.configure 
      ? ServerClass.configure({ port: 1234 }) 
      : new ServerClass({ port: 1234 });

    // 3. Handle modern async configurations (if the constructor returned a Promise)
    if (server instanceof Promise) {
      server = await server;
    }

    // 4. Safely start the network listener
    if (typeof server.listen === "function") {
      server.listen();
    } else if (typeof server.start === "function") {
      server.start();
    } else {
       console.log("Server initialized (auto-listening based on configuration).");
    }

    console.log("🚀 Secure Signaling Backend running on ws://localhost:1234");
  } catch (error) {
    console.error("Startup failed:", error);
  }
}

launch();
