import { useState } from "react";
import Editor from "./components/Editor";

export default function App() {
  const [accessCode, setAccessCode] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  // Handles the login form submission
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim().length > 3) {
      setIsJoined(true);
    } else {
      alert("Please enter a code that is at least 4 characters long.");
    }
  };

  // State 1: The Login Screen
  if (!isJoined) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
        <form onSubmit={handleJoin} style={{ padding: "2rem", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ marginTop: 0 }}>Join Workspace</h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>Enter your secure access code to join the session.</p>
          <input 
            type="text" 
            placeholder="e.g. ALPHA-99" 
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            style={{ padding: "0.75rem", width: "100%", boxSizing: "border-box", marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Enter Workspace
          </button>
        </form>
      </div>
    );
  }

  // State 2: The Editor (Passing the code as a prop)
  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Editor roomCode={accessCode} />
    </div>
  );
}