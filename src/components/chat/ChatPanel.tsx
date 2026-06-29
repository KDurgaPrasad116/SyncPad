import type { ChatMessage } from "../../types/chat";
import type { Dispatch, SetStateAction } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";


interface ChatPanelProps {
  messages: ChatMessage[];
  userName: string;

  pendingAudio: string | null;
  discardAudio: () => void;

  chatInput: string;
  setChatInput: Dispatch<SetStateAction<string>>;

  isRecording: boolean;
  toggleRecording: () => Promise<void>;

  sendMessage: () => void;

  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function ChatPanel({
  messages,
  userName,
  pendingAudio,
  discardAudio,
  chatInput,
  setChatInput,
  isRecording,
  toggleRecording,
  sendMessage,
  handleFileUpload,
}: ChatPanelProps) {
  return (
    <div
      id="chat-view"
      className="panel chat-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        border: "1px solid #ddd",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "15px",
          backgroundColor: "#000",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Team Chat
      </div>

      <div
        style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              color: "#888",
              textAlign: "center",
              marginTop: "50px",
            }}
          >
            No messages yet.
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              currentUser={userName}
            />
          ))
        )}
      </div>

      <ChatInput
        pendingAudio={pendingAudio}
        discardAudio={discardAudio}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        sendMessage={sendMessage}
        handleFileUpload={handleFileUpload}
      />
    </div>
  );
}