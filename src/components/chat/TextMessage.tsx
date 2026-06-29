import LinkPreview from "./LinkPreview";
import renderMessageText from "../../utils/renderMessageText";

interface Props {
  content: string;
  isOwnMessage: boolean;
}

export default function TextMessage({
  content,
  isOwnMessage,
}: Props) {
  return (
    <>
      <div style={{ wordBreak: "break-word" }}>
        {renderMessageText(content, isOwnMessage)}
      </div>

      {content.startsWith("http") && (
        <LinkPreview
          url={content}
          isOwnMessage={isOwnMessage}
        />
      )}
    </>
  );
}