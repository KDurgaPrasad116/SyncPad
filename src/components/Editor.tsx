import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Imports the clean editor styling

export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // This stops React from accidentally loading two editors at the same time
    if (!containerRef.current || isInitialized.current) return;

    // Load the Quill editor into the container
    new Quill(containerRef.current, {
      theme: "snow",
      placeholder: "Start typing your notes here...",
    });

    isInitialized.current = true;
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Workspace</h2>
      {/* The editor will physically render inside this div */}
      <div ref={containerRef} style={{ height: "500px", backgroundColor: "#fff" }} />
    </div>
  );
}