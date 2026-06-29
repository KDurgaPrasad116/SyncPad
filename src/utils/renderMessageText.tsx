export default function renderMessageText(
  text: string,
  isOwnMessage: boolean
) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isOwnMessage ? "#fff" : "#0d6efd",
            textDecoration: "underline",
            wordBreak: "break-all",
            fontWeight: "bold",
          }}
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}