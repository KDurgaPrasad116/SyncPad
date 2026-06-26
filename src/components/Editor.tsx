import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { QuillBinding } from "y-quill";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

const cursorColors = ["#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#FFC107", "#E91E63", "#00BCD4"];
const myColor = cursorColors[Math.floor(Math.random() * cursorColors.length)];

// The Editor now requires both the roomCode and the user's chosen name
export default function Editor({ roomCode, userName }: { roomCode: string, userName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      modules: {
        cursors: true, 
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }]
        ]
      },
      placeholder: `Secure session active. Start typing...`,
    });

    const ydoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: import.meta.env.VITE_WS_URL || "ws://localhost:1234",
      name: "secure-workspace-" + roomCode, // Fixed: Now uses the actual room code!
      document: ydoc,
    });

    // We now broadcast the actual userName instead of the random Guest string
    provider.awareness!.setLocalStateField("user", {
      name: userName,
      color: myColor,
    });

    provider!.on("status", (event: { status: string }) => {
      console.log(`Network Status: ${event.status}`);
    });

    const ytext = ydoc.getText("quill");
    
    // Fixed: Save the binding to a variable so we can destroy it later
    const binding = new QuillBinding(ytext, quill, provider.awareness!); 

    isInitialized.current = true;

    return () => {
      // Fixed: Removed 'const' so this is a valid method call
      binding.destroy(); 
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomCode, userName]);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* --- INJECTED CSS TO FORCE PERMANENT CURSORS --- */}
      <style>
        {`
          .ql-cursor-flag {
            opacity: 1 !important;
            visibility: visible !important;
            transition: none !important;
            display: block !important;
          }
          .ql-cursor-caret {
            opacity: 1 !important;
            visibility: visible !important;
          }
        `}
      </style>
      {/* ----------------------------------------------- */}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Workspace: {roomCode}</h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
            Logged in as: <strong>{userName}</strong>
          </p>
        </div>
        <span style={{ padding: "0.25rem 0.75rem", backgroundColor: "#e8f5e9", color: "#2e7d32", borderRadius: "16px", fontSize: "0.875rem", fontWeight: "bold", height: "fit-content" }}>
          Live Online
        </span>
      </div>
      <div ref={containerRef} style={{ height: "500px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} />
    </div>
  );
}
