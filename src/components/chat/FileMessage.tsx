interface Props {
  fileName: string;
  content: string;
  isOwnMessage: boolean;
}

export default function FileMessage({
  fileName,
  content,
  isOwnMessage,
}: Props) {
  return (
    <a
      href={content}
      download={fileName}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        backgroundColor: isOwnMessage
          ? "rgba(255,255,255,.2)"
          : "rgba(0,0,0,.05)",
        color: isOwnMessage
          ? "#fff"
          : "#007bff",
        textDecoration: "none",
        borderRadius: "6px",
        fontWeight: 500,
        marginTop: "4px",
        fontSize: ".85rem",
      }}
    >
      📄 Download {fileName}
    </a>
  );
}