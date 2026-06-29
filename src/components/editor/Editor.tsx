import { useRef, useState } from "react";
import useChat from "../../hooks/useChat";
import "quill/dist/quill.snow.css";
import "../../styles/editor.css";
import "../../styles/chat.css";
import "../../styles/mobile.css";
import MobileTabs from "../layout/MobileTabs"; 
// Hooks
import useAudioRecorder from "../../hooks/useAudioRecorder";

import ChatPanel from "../chat/ChatPanel";

import WorkspaceHeader from "./WorkspaceHeader";

import useCollaborativeEditor from "../../hooks/useCollaborativeEditor";
import EditorCanvas from "./EditorCanvas";
import { CURSOR_COLORS } from "../../utils/constants";

// Types
import type { ChatMessage, ActiveUser } from "../../types/chat";
import useMobileNavigation from "../../hooks/useMobileNavigation";

const myColor =
  CURSOR_COLORS[
    Math.floor(Math.random() * CURSOR_COLORS.length)
  ];

const { scrollToPanel } = useMobileNavigation();


// ============================================================================
// 3. MAIN UI COMPONENT (Simplified)
// ============================================================================
export default function Editor({ roomCode, userName }: { roomCode: string, userName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatArrayRef = useRef<any>(null);

  const { isRecording, pendingAudio, setPendingAudio, toggleRecording, discardAudio } = useAudioRecorder();

  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  const {
      chatInput,
      setChatInput,
      sendMessage,
      handleFileUpload,
  } = useChat(
      userName,
      chatArrayRef,
      pendingAudio,
      setPendingAudio
  );

  // Initialize Real-time Connection
  useCollaborativeEditor({
    roomCode,
    userName,
    color: myColor,
    containerRef,
    chatArrayRef,
    setMessages,
    setActiveUsers,
  });
  return (
    <div className="app-wrapper">
      <MobileTabs
      onChatClick={() => scrollToPanel("chat-view")}
      onEditorClick={() => scrollToPanel("editor-view")}
    />
      <div className="slider-container">
        
        {/* ======================================================== */}
        {/* LEFT SIDE: The Chat Sidebar                              */}
        {/* ======================================================== */}
           <ChatPanel
            messages={messages}
            userName={userName}
            pendingAudio={pendingAudio}
            discardAudio={discardAudio}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            sendMessage={sendMessage}
            handleFileUpload={handleFileUpload}
        />

        {/* ======================================================== */}
        {/* RIGHT SIDE: The Document Editor                          */}
        {/* ======================================================== */}
        <div id="editor-view" className="panel editor-panel">
          <WorkspaceHeader
            roomCode={roomCode}
            userName={userName}
            activeUsers={activeUsers}
            showUserList={showUserList}
            setShowUserList={setShowUserList}
          />
          <EditorCanvas
            containerRef={containerRef}
          />
        </div>

      </div>
    </div>
  );
}