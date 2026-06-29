import AudioPlayer from "../audio/AudioPlayer";
import LinkPreview from "./LinkPreview";
import renderMessageText from "../../utils/renderMessageText";
import type { ChatMessage } from "../../types/chat";

interface ChatMessageProps {
  msg: ChatMessage;
  currentUser: string;
}

export default function MessageBubble({
  msg,
  currentUser,
}: ChatMessageProps) {
  const isOwnMessage = msg.sender === currentUser;

  return (
    <div
      style={{
        alignSelf: isOwnMessage ? "flex-end" : "flex-start",
        backgroundColor: isOwnMessage ? "#007bff" : "#e9ecef",
        color: isOwnMessage ? "#fff" : "#000",
        padding: "8px 12px",
        borderRadius: "12px",
        maxWidth: "85%",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          opacity: 0.8,
          marginBottom: "4px",
        }}
      >
        {isOwnMessage ? "You" : msg.sender} • {msg.timestamp}
      </div>

      {msg.type === "file" ? (
        <a
          href={msg.content}
          download={msg.fileName}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            backgroundColor: isOwnMessage
              ? "rgba(255,255,255,0.2)"
              : "rgba(0,0,0,0.05)",
            color: isOwnMessage ? "#fff" : "#007bff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "500",
            marginTop: "4px",
            fontSize: "0.85rem",
          }}
        >
          📄 Download {msg.fileName}
        </a>
      ) : msg.type === "audio" ? (
        <AudioPlayer
          src={msg.content}
          isOwnMessage={isOwnMessage}
        />
      ) : (
        <div>
          <div style={{ wordBreak: "break-word" }}>
            {renderMessageText(msg.content, isOwnMessage)}
          </div>

          {msg.content.startsWith("http") && (
            <LinkPreview
              url={msg.content}
              isOwnMessage={isOwnMessage}
            />
          )}
        </div>
      )}
    </div>
  );
}