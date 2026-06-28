import { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  isOwnMessage: boolean;
}

export default function AudioPlayer({
  src,
  isOwnMessage,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const loaded = () => {
      setDuration(audio.duration);
    };

    const play = () => setPlaying(true);
    const pause = () => setPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("play", play);
    audio.addEventListener("pause", pause);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("play", play);
      audio.removeEventListener("pause", pause);
    };
  }, []);

  const format = (time: number) => {
    if (!time) return "0:00";

    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px",
        borderRadius: "14px",
        marginTop: "6px",
        background: isOwnMessage ? "#005fd4" : "#f1f3f5",
        width: "250px",
      }}
    >
      <button
        onClick={togglePlay}
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "#fff",
          fontSize: "18px",
        }}
      >
        {playing ? "⏸" : "▶"}
      </button>

      <div style={{ flex: 1 }}>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = Number(e.target.value);
            setProgress(Number(e.target.value));
          }}
          style={{ width: "100%" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            color: isOwnMessage ? "#fff" : "#555",
          }}
        >
          <span>{format(progress)}</span>
          <span>{format(duration)}</span>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}