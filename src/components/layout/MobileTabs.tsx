interface MobileTabsProps {
  onChatClick: () => void;
  onEditorClick: () => void;
}

export default function MobileTabs({
  onChatClick,
  onEditorClick,
}: MobileTabsProps) {
  return (
    <div className="mobile-tabs">
      <button
        className="mobile-tab-btn"
        onClick={onChatClick}
      >
        💬 Team Chat
      </button>

      <button
        className="mobile-tab-btn"
        onClick={onEditorClick}
      >
        📝 Workspace
      </button>
    </div>
  );
}