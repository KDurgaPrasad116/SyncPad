interface LinkPreviewProps {
  url: string;
  isOwnMessage: boolean;
}

export default function LinkPreview({
  url,
  isOwnMessage,
}: LinkPreviewProps) {
  const ytRegex =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;

  const ytMatch = url.match(ytRegex);

  const isYouTube =
    ytMatch && ytMatch[2].length === 11;

  const ytVideoId = isYouTube ? ytMatch[2] : null;

  const imgSrc = isYouTube
    ? `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`
    : `https://image.thum.io/get/width/400/crop/700/${url}`;

  return (
    <div
      style={{
        marginTop: "8px",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: isOwnMessage
          ? "rgba(255,255,255,0.3)"
          : "#ddd",
        backgroundColor: isOwnMessage
          ? "rgba(255,255,255,0.1)"
          : "#fff",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => window.open(url, "_blank")}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "120px",
          backgroundColor: isOwnMessage
            ? "rgba(255,255,255,0.2)"
            : "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
        }}
      >
        <div style={{ position: "absolute" }}>🌐</div>

        <img
          src={imgSrc}
          alt="Website preview"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            zIndex: 1,
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {isYouTube && (
          <div
            style={{
              position: "absolute",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "1.2rem",
              paddingLeft: "4px",
            }}
          >
            ▶
          </div>
        )}
      </div>

      <div
        style={{
          padding: "8px",
          fontSize: "0.85rem",
          color: isOwnMessage ? "#fff" : "#000",
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: "2px",
          }}
        >
          {isYouTube
            ? "YouTube Video"
            : new URL(url).hostname}
        </strong>

        <span
          style={{
            opacity: 0.8,
            fontSize: "0.75rem",
            display: "block",
          }}
        >
          Click to open...
        </span>
      </div>
    </div>
  );
}