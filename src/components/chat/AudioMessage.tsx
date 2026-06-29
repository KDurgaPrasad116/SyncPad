import AudioPlayer from "../audio/AudioPlayer";

interface Props {
  src: string;
  isOwnMessage: boolean;
}

export default function AudioMessage({
  src,
  isOwnMessage,
}: Props) {
  return (
    <AudioPlayer
      src={src}
      isOwnMessage={isOwnMessage}
    />
  );
}