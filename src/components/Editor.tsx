import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider"; // The modern provider
import { QuillBinding } from "y-quill";

export default function Editor({ roomCode }: { roomCode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      placeholder: `Secure session active. Start typing...`,
    });

    const ydoc = new Y.Doc();

    // Target your newly built local server instead of the broken public one
    const provider = new HocuspocusProvider({
      url: "ws://localhost:1234",
      name: `secure-workspace-${roomCode}`,
      document: ydoc,
    });

    provider.on("status", (event: { status: string }) => {
      console.log(`Network Status: ${event.status}`);
    });

    const ytext = ydoc.getText("quill");
    const binding = new QuillBinding(ytext, quill, provider.awareness);

    isInitialized.current = true;

    return () => {
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomCode]);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0 }}>Workspace: {roomCode}</h2>
        <span style={{ padding: "0.25rem 0.75rem", backgroundColor: "#e8f5e9", color: "#2e7d32", borderRadius: "16px", fontSize: "0.875rem", fontWeight: "bold" }}>
          Live Online
        </span>
      </div>
      <div ref={containerRef} style={{ height: "500px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} />
    </div>
  );
}