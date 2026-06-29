interface ChatInputProps {
  pendingAudio: string | null;
  discardAudio: () => void;
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  isRecording: boolean;
  toggleRecording: () => void;
  sendMessage: () => void;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function ChatInput({
  pendingAudio,
  discardAudio,
  chatInput,
  setChatInput,
  isRecording,
  toggleRecording,
  sendMessage,
  handleFileUpload,
}: ChatInputProps) {
  return (
    <div
      className="chat-input-container"
      style={{
        backgroundColor: "#fff",
        borderTop: "1px solid #ddd",
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      {pendingAudio ? (
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            gap: "8px",
          }}
        >
          <button
            onClick={discardAudio}
            style={{
              border: "none",
              background: "#ffecec",
              color: "#dc3545",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              cursor: "pointer",
            }}
          >
            🗑️
          </button>

          <audio
            controls
            src={pendingAudio}
            style={{
              flex: 1,
              height: "35px",
            }}
          />
        </div>
      ) : (
        <>
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          <label
            htmlFor="file-upload"
            style={{
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "5px",
            }}
          >
            📎
          </label>

          <input
            className="chat-text-input"
            value={chatInput}
            disabled={isRecording}
            placeholder="Type a message..."
            onChange={(e) =>
              setChatInput(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "4px",
              minWidth: 0,
            }}
          />

          <button
            className="chat-action-btn"
            onClick={toggleRecording}
            style={{
              backgroundColor: isRecording
                ? "#dc3545"
                : "#e9ecef",
              color: isRecording ? "#fff" : "#000",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              width: "40px",
              height: "40px",
            }}
          >
            {isRecording ? "⏹" : "🎤"}
          </button>
        </>
      )}

      <button
        className="chat-send-btn"
        onClick={sendMessage}
        disabled={
          isRecording ||
          (!pendingAudio && !chatInput.trim())
        }
      >
        Send
      </button>
    </div>
  );
}