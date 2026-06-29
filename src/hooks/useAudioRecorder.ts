import { useRef, useState } from "react";

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [pendingAudio, setPendingAudio] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          const reader = new FileReader();

          reader.readAsDataURL(audioBlob);

          reader.onloadend = () => {
            setPendingAudio(reader.result as string);
          };

          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.onerror = (event) => {
          console.error(event);

          alert("An error occurred while recording.");

          setIsRecording(false);
        };

        mediaRecorder.start();

        setIsRecording(true);
      } catch (error: any) {
        console.error(error);

        alert(
          `Could not access microphone: ${
            error.message || "Permission denied"
          }`
        );
      }
    } else {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();

        setIsRecording(false);
      }
    }
  };

  const discardAudio = () => {
    setPendingAudio(null);

    audioChunksRef.current = [];
  };

  return {
    isRecording,
    pendingAudio,
    setPendingAudio,
    toggleRecording,
    discardAudio,
  };
}