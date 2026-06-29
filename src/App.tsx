import { useState } from "react";
import Editor from "./components/editor/Editor";

export default function App() {
  const [accessCode, setAccessCode] = useState("");
  const [userName, setUserName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim().length < 4) {
      alert("Please enter a workspace code that is at least 4 characters long.");
      return;
    }
    if (userName.trim().length === 0) {
      alert("Please enter a display name so others know who you are.");
      return;
    }
    setIsJoined(true);
  };

  // State 1: The Minimalist Login Screen
  if (!isJoined) {
    return (
      <div className="syncpad-wrapper">
        <style>
          {`
            /* Modern Font & Global Reset */
            :root { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
            body { margin: 0; padding: 0; background-color: #ffffff; color: #111111; }
            
            /* The Clean Background */
            .syncpad-wrapper {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #fafafa;
              padding: 1rem;
            }

            /* The Minimalist Card */
            .minimal-card {
              background: #ffffff;
              padding: 3rem 2.5rem;
              width: 100%;
              max-width: 380px;
              border: 1px solid #e5e5e5;
              border-radius: 12px;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
              text-align: center;
            }

            /* Branding Typography */
            .brand-title {
              font-size: 2.5rem;
              font-weight: 800;
              letter-spacing: -1px;
              color: #000000;
              margin: 0 0 0.5rem 0;
            }
            .brand-subtitle {
              color: #666666;
              font-size: 0.95rem;
              margin-bottom: 2.5rem;
              line-height: 1.5;
            }

            /* Inputs & Buttons */
            .minimal-input {
              width: 100%;
              padding: 0.85rem 1rem;
              box-sizing: border-box;
              margin-bottom: 1.25rem;
              background: #ffffff;
              border: 1px solid #d4d4d4;
              border-radius: 6px;
              color: #000000;
              font-size: 1rem;
              transition: all 0.2s ease;
            }
            .minimal-input::placeholder { color: #a3a3a3; }
            .minimal-input:focus {
              outline: none;
              border-color: #000000;
              box-shadow: 0 0 0 1px #000000;
            }

            .join-btn {
              width: 100%;
              padding: 0.85rem;
              background: #000000;
              color: #ffffff;
              border: none;
              border-radius: 6px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: background-color 0.2s ease;
            }
            .join-btn:hover { background: #333333; }
            .join-btn:active { transform: translateY(1px); }
          `}
        </style>

        <div className="minimal-card">
          <h1 className="brand-title">SyncPad</h1>
          <p className="brand-subtitle">Real-time collaborative workspaces.<br/>Engineered for speed.</p>
          
          <form onSubmit={handleJoin}>
            <input 
              className="minimal-input"
              type="text" 
              placeholder="Your Display Name" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input 
              className="minimal-input"
              type="text" 
              placeholder="Workspace Code" 
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              required
            />
            <button className="join-btn" type="submit">
              Enter Workspace
            </button>
          </form>
        </div>
      </div>
    );
  }

  // State 2: The Editor
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Editor roomCode={accessCode} userName={userName} />
    </div>
  );
}