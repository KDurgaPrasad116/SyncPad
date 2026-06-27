import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { QuillBinding } from "y-quill";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

const cursorColors = ["#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#FFC107", "#E91E63", "#00BCD4"];
const myColor = cursorColors[Math.floor(Math.random() * cursorColors.length)];

export default function Editor({ roomCode, userName }: { roomCode: string, userName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  
  const [messages, setMessages] = useState<any[]>([]);
  const chatArrayRef = useRef<Y.Array<any> | null>(null);
  const [chatInput, setChatInput] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- AWARENESS STATES FOR ACTIVE USERS ---
  const [activeUsers, setActiveUsers] = useState<{id: string, name: string, color: string}[]>([]);
  const [showUserList, setShowUserList] = useState(false);

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
    
    // Removed import.meta.env to prevent the [WARNING] in older ES2015 build targets.
    // When you are ready to deploy, manually swap this to your wss:// Render URL!
   const wsUrl = import.meta.env.VITE_WS_URL ?? "ws://localhost:1234";

  const provider = new HocuspocusProvider({
    url: wsUrl,
    name: `secure-workspace-${roomCode}`,
    document: ydoc,
});

    // Set our own user information in the awareness state
    provider.awareness!.setLocalStateField("user", {
      name: userName,
      color: myColor,
    });

    // --- LISTEN FOR AWARENESS CHANGES ---
    const updateUsers = () => {
      const states = provider.awareness!.getStates();
      const users: {id: string, name: string, color: string}[] = [];
      states.forEach((state, clientId) => {
        if (state.user) {
          users.push({ id: clientId.toString(), ...state.user });
        }
      });
      setActiveUsers(users);
    };

    provider.awareness!.on('change', updateUsers);
    updateUsers(); // Initial call to get users currently in room

    const ytext = ydoc.getText("quill");
    const binding = new QuillBinding(ytext, quill, provider.awareness!); 

    const ychat = ydoc.getArray("chat");
    chatArrayRef.current = ychat;

    ychat.observe(() => {
      setMessages(ychat.toArray());
    });

    isInitialized.current = true;

    return () => {
      binding.destroy(); 
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomCode, userName]);

  const sendMessage = () => {
    if (chatInput.trim() === "" || !chatArrayRef.current) return;
    chatArrayRef.current.push([{
      id: Date.now().toString(),
      sender: userName,
      type: "text",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput(""); 
  };

  const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder Error:", event);
      alert("Recording error.");
    };

    mediaRecorderRef.current = mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const reader = new FileReader();

      reader.readAsDataURL(audioBlob);

      reader.onloadend = () => {
        if (chatArrayRef.current) {
          chatArrayRef.current.push([
            {
              id: Date.now().toString(),
              sender: userName,
              type: "audio",
              content: reader.result,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      };

      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();

    setIsRecording(true);
  } catch (error) {
    console.error("Microphone Access Error:", error);

    alert("Could not access microphone.");
  }
};

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !chatArrayRef.current) return;
    if (file.size > 2 * 1024 * 1024) return alert("File is too large! Please keep it under 2MB.");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      chatArrayRef.current!.push([{
        id: Date.now().toString(),
        sender: userName,
        type: "file",
        fileName: file.name,
        content: reader.result, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    };
  };

  const renderMessageText = (text: string, isOwnMessage: boolean) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: isOwnMessage ? "#fff" : "#0d6efd", textDecoration: "underline", wordBreak: "break-all", fontWeight: "bold" }}>
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const scrollToPanel = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", inline: "center" });
  };

  return (
    <div className="app-wrapper">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" />
      <style>
        {`
          /* Universal Box Sizing prevents padding from expanding elements off-screen */
          * { box-sizing: border-box; }
          
          .ql-cursor-flag { opacity: 1 !important; visibility: visible !important; transition: none !important; display: block !important; }
          .ql-cursor-caret { opacity: 1 !important; visibility: visible !important; }
          
          .app-wrapper {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            height: 100dvh; 
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          .mobile-tabs { display: none; }
          .slider-container { display: flex; gap: 20px; height: 100%; width: 100%; }
          .panel { height: 560px; }
          .chat-panel { flex: 1; min-width: 300px; }
          .editor-panel { flex: 2; min-width: 0; }

          .chat-input-container { padding: 10px; }
          .chat-text-input { padding: 10px; }
          .chat-action-btn { width: 40px; height: 40px; }
          .chat-send-btn { padding: 10px 15px; }

          /* MOBILE & MINIMIZED DESKTOP STYLES */
          @media (max-width: 768px) {
            .app-wrapper { padding: 0; }
            
            .mobile-tabs {
              display: flex; justify-content: center; gap: 10px; padding: 10px;
              background-color: #fff; border-bottom: 1px solid #ddd; z-index: 10;
              width: 100%;
            }
            .mobile-tab-btn {
              padding: 6px 16px; border-radius: 20px; border: 1px solid #007bff;
              background: transparent; color: #007bff; font-weight: bold; cursor: pointer;
            }
            .mobile-tab-btn:active { background: #007bff; color: #fff; }

            .slider-container {
              gap: 0; 
              overflow-x: auto; 
              scroll-snap-type: x mandatory;
              scroll-behavior: smooth; 
              -webkit-overflow-scrolling: touch;
              width: 100%;
            }
            .slider-container::-webkit-scrollbar { display: none; }
            .slider-container { -ms-overflow-style: none; scrollbar-width: none; }

            .panel {
              /* flex: 0 0 100% guarantees it takes exactly the screen width, no more, no less */
              flex: 0 0 100%; 
              scroll-snap-align: center; /* Snaps perfectly into the center */
              padding: 15px; 
              height: calc(100dvh - 55px); 
            }

            .chat-input-container { padding: 6px 8px; gap: 6px !important; }
            .chat-text-input { padding: 8px; font-size: 0.9rem; }
            .chat-action-btn { width: 38px; height: 38px; padding: 0; }
            .chat-send-btn { padding: 8px 12px; font-size: 0.9rem; }
          }
        `}
      </style>

      {/* MOBILE NAVIGATION TABS */}
      <div className="mobile-tabs">
        <button className="mobile-tab-btn" onClick={() => scrollToPanel('chat-view')}>💬 Team Chat</button>
        <button className="mobile-tab-btn" onClick={() => scrollToPanel('editor-view')}>📝 Workspace</button>
      </div>

      {/* MAIN SLIDER CONTAINER */}
      <div className="slider-container">
        
        {/* ======================================================== */}
        {/* LEFT SIDE: The Chat Sidebar                              */}
        {/* ======================================================== */}
        <div id="chat-view" className="panel chat-panel" style={{ display: "flex", flexDirection: "column", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #ddd", overflow: "hidden" }}>
          <div style={{ padding: "15px", backgroundColor: "#000", color: "#fff", fontWeight: "bold" }}>
            Team Chat
          </div>
          
          <div style={{ flex: "1", padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", marginTop: "50px" }}>No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} style={{ 
                  alignSelf: msg.sender === userName ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === userName ? "#007bff" : "#e9ecef",
                  color: msg.sender === userName ? "#fff" : "#000",
                  padding: "8px 12px", borderRadius: "12px", maxWidth: "85%"
                }}>
                  <div style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "4px" }}>
                    {msg.sender === userName ? "You" : msg.sender} • {msg.timestamp}
                  </div>
                  
                  {msg.type === "file" ? (
                    <a href={msg.content} download={msg.fileName} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: msg.sender === userName ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)", color: msg.sender === userName ? "#fff" : "#007bff", textDecoration: "none", borderRadius: "6px", fontWeight: "500", marginTop: "4px", fontSize: "0.85rem" }}>
                      📄 Download {msg.fileName}
                    </a>
                  ) : msg.type === "audio" ? (
                    <audio controls src={msg.content} style={{ height: "30px", width: "200px" }} />
                  ) : (
                    <div>
                      <div style={{ wordBreak: "break-word" }}>
                        {renderMessageText(msg.content, msg.sender === userName)}
                      </div>
                      {msg.content.startsWith("http") && (() => {
                        const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
                        const ytMatch = msg.content.match(ytRegex);
                        const isYouTube = ytMatch && ytMatch[2].length === 11;
                        const ytVideoId = isYouTube ? ytMatch[2] : null;
                        const imgSrc = isYouTube ? `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg` : `https://image.thum.io/get/width/400/crop/700/${msg.content}`;

                        return (
                          <div style={{ marginTop: "8px", borderRadius: "8px", border: "1px solid", borderColor: msg.sender === userName ? "rgba(255,255,255,0.3)" : "#ddd", backgroundColor: msg.sender === userName ? "rgba(255,255,255,0.1)" : "#fff", overflow: "hidden", cursor: "pointer" }} onClick={() => window.open(msg.content, '_blank')}>
                            <div style={{ position: "relative", width: "100%", height: "120px", backgroundColor: msg.sender === userName ? "rgba(255,255,255,0.2)" : "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                              <div style={{ position: "absolute" }}>🌐</div>
                              <img src={imgSrc} alt="Website preview" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block", zIndex: 1 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                              {isYouTube && (
                                <div style={{ position: "absolute", zIndex: 2, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.2rem", paddingLeft: "4px" }}>▶</div>
                              )}
                            </div>
                            <div style={{ padding: "8px", fontSize: "0.85rem", color: msg.sender === userName ? "#fff" : "#000" }}>
                              <strong style={{ display: "block", marginBottom: "2px" }}>{isYouTube ? "YouTube Video" : new URL(msg.content).hostname}</strong>
                              <span style={{ opacity: 0.8, fontSize: "0.75rem", display: "block" }}>Click to open...</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="chat-input-container" style={{ backgroundColor: "#fff", borderTop: "1px solid #ddd", display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="file" onChange={handleFileUpload} style={{ display: "none" }} id="file-upload" />
            <label htmlFor="file-upload" style={{ cursor: "pointer", fontSize: "1.2rem", padding: "5px", flexShrink: 0 }} title="Attach file">📎</label>
            <input className="chat-text-input" type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." style={{ flex: "1", borderRadius: "4px", border: "1px solid #ccc", minWidth: "0" }} disabled={isRecording} />
            <button className="chat-action-btn" onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording} style={{ backgroundColor: isRecording ? "#dc3545" : "#e9ecef", color: isRecording ? "#fff" : "#000", border: "none", borderRadius: "50%", cursor: "pointer", flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center", transition: "background-color 0.2s" }} title="Hold to record audio">{isRecording ? "⏹" : "🎤"}</button>
            <button className="chat-send-btn" onClick={sendMessage} disabled={isRecording} style={{ backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", flexShrink: 0 }}>Send</button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT SIDE: The Document Editor                          */}
        {/* ======================================================== */}
        <div id="editor-view" className="panel editor-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Workspace: {roomCode}</h2>
              <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.85rem" }}>
                Logged in as: <strong>{userName}</strong>
              </p>
            </div>
            
            {/* LIVE USERS BADGE & DROPDOWN */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
              <button 
                onClick={() => setShowUserList(!showUserList)}
                style={{ 
                  padding: "0.35rem 0.75rem", 
                  backgroundColor: "#e3f2fd", 
                  color: "#0d6efd", 
                  borderRadius: "16px", 
                  fontSize: "0.85rem", 
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                👥 {activeUsers.length}
              </button>
              
              <span style={{ padding: "0.35rem 0.75rem", backgroundColor: "#e8f5e9", color: "#2e7d32", borderRadius: "16px", fontSize: "0.85rem", fontWeight: "bold" }}>
                Live
              </span>

              {/* User List Dropdown UI */}
              {showUserList && (
                <div style={{ 
                  position: "absolute", 
                  top: "100%", 
                  right: 0, 
                  marginTop: "8px", 
                  backgroundColor: "#fff", 
                  border: "1px solid #ddd", 
                  borderRadius: "8px", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)", 
                  zIndex: 100, 
                  width: "200px", 
                  padding: "12px" 
                }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: "6px", marginBottom: "8px", color: "#666" }}>
                    Active Users In Room
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {activeUsers.map(u => (
                      <li key={u.id} style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px", color: "#333" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: u.color, display: "inline-block" }}></span>
                        {u.name} {u.name === userName ? <span style={{ opacity: 0.5 }}>(You)</span> : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div ref={containerRef} style={{ height: "calc(100% - 60px)", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "4px", overflow: "hidden" }} />
        </div>

      </div>
    </div>
  );
}
