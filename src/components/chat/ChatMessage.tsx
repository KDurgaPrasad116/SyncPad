import type { ChatMessage as Message } from "../../types/chat";

import AudioMessage from "./AudioMessage";
import FileMessage from "./FileMessage";
import TextMessage from "./TextMessage";

interface Props {
  msg: Message;
  userName: string;
}

export default function ChatMessage({
  msg,
  userName,
}: Props) {
  const isOwnMessage =
    msg.sender === userName;

  return (
    <div
      style={{
        alignSelf: isOwnMessage
          ? "flex-end"
          : "flex-start",
        backgroundColor: isOwnMessage
          ? "#007bff"
          : "#e9ecef",
        color: isOwnMessage
          ? "#fff"
          : "#000",
        padding: "8px 12px",
        borderRadius: "12px",
        maxWidth: "85%",
      }}
    >
      <div
        style={{
          fontSize: ".75rem",
          opacity: .8,
          marginBottom: 4,
        }}
      >
        {isOwnMessage ? "You" : msg.sender}
        {" • "}
        {msg.timestamp}
      </div>

      {msg.type === "text" && (
        <TextMessage
          content={msg.content}
          isOwnMessage={isOwnMessage}
        />
      )}

      {msg.type === "audio" && (
        <AudioMessage
          src={msg.content}
          isOwnMessage={isOwnMessage}
        />
      )}

      {msg.type === "file" && (
        <FileMessage
          fileName={msg.fileName!}
          content={msg.content}
          isOwnMessage={isOwnMessage}
        />
      )}
    </div>
  );
}