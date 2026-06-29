interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function EditorCanvas({
  containerRef,
}: Props) {
  return (
    <div
      ref={containerRef}
      className="editor-canvas"
    />
  );
}