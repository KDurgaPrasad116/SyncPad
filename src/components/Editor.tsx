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

  // --- NEW VOICE RECORDING STATES ---
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
      name: "secure-workspace-" + roomCode,
      document: ydoc,
    });

    provider.awareness!.setLocalStateField("user", {
      name: userName,
      color: myColor,
    });

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

  // --- TEXT MESSAGE LOGIC ---
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

  // --- VOICE RECORDING LOGIC ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convert Blob to Base64 to send over WebSockets
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64AudioMessage = reader.result;
          if (chatArrayRef.current) {
            chatArrayRef.current.push([{
              id: Date.now().toString(),
              sender: userName,
              type: "audio",
              content: base64AudioMessage, // The audio file!
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          }
        };

        // Stop all microphone tracks to turn off the red recording light in the browser
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <style>
        {`
          .ql-cursor-flag { opacity: 1 !important; visibility: visible !important; transition: none !important; display: block !important; }
          .ql-cursor-caret { opacity: 1 !important; visibility: visible !important; }
        `}
      </style>

      {/* LEFT SIDE: The Document Editor */}
      <div style={{ flex: "2" }}>
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

      {/* RIGHT SIDE: The Chat Sidebar */}
      <div style={{ flex: "1", display: "flex", flexDirection: "column", height: "560px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #ddd", overflow: "hidden" }}>
        <div style={{ padding: "15px", backgroundColor: "#000", color: "#fff", fontWeight: "bold" }}>
          Team Chat
        </div>
        
        {/* Chat Messages Area */}
        <div style={{ flex: "1", padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {messages.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", marginTop: "50px" }}>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={{ 
                alignSelf: msg.sender === userName ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === userName ? "#007bff" : "#e9ecef",
                color: msg.sender === userName ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: "12px",
                maxWidth: "85%"
              }}>
                <div style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "4px" }}>
                  {msg.sender === userName ? "You" : msg.sender} • {msg.timestamp}
                </div>
                
                {/* Dynamically render text OR an audio player */}
                {msg.type === "audio" ? (
                  <audio controls src={msg.content} style={{ height: "30px", width: "200px" }} />
                ) : (
                  <div style={{ wordBreak: "break-word" }}>{msg.content}</div>
                )}
                
              </div>
            ))
          )}
        </div>

        {/* Chat Input Area */}
        <div style={{ padding: "10px", backgroundColor: "#fff", borderTop: "1px solid #ddd", display: "flex", gap: "8px", alignItems: "center" }}>
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: "1", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            disabled={isRecording}
          />
          
          {/* Voice Record Button */}
          <button 
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording} // Stops if they drag their mouse away
            style={{ 
              padding: "10px", 
              backgroundColor: isRecording ? "#dc3545" : "#e9ecef", 
              color: isRecording ? "#fff" : "#000", 
              border: "none", 
              borderRadius: "50%", 
              cursor: "pointer",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "background-color 0.2s"
            }}
            title="Hold to record audio"
          >
            {isRecording ? "⏹" : "🎤"}
          </button>

          <button onClick={sendMessage} disabled={isRecording} style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Send
          </button>
        </div>
      </div>

    </div>
  );
}