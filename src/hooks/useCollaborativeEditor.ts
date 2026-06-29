import { useEffect, useRef } from "react";
import Quill from "quill";
import { createCollaborationSession } from "../services/collaboration.service";
import type { ActiveUser } from "../types/chat";

interface Props {
  roomCode: string;
  userName: string;
  color: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  chatArrayRef: React.MutableRefObject<any>;
  setActiveUsers: React.Dispatch<React.SetStateAction<ActiveUser[]>>;
}

export default function useCollaborativeEditor({
  roomCode,
  userName,
  color,
  containerRef,
  setMessages,
  chatArrayRef,
  setActiveUsers, // Ensure this is received
}: Props) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      modules: {
        cursors: true,
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
    });

    const {
      ydoc,
      provider,
      binding,
      chatArray,
    } = createCollaborationSession(roomCode, userName, color, quill);

    // 1. Setup Chat Messaging
    chatArrayRef.current = chatArray;
    chatArrayRef.current.observe(() => {
      setMessages(chatArrayRef.current.toArray());
    });

    // 2. SETUP USER COUNTER / AWARENESS
    const updateUsers = () => {
      const states = provider.awareness!.getStates();
      const users: ActiveUser[] = [];
      states.forEach((state, clientId) => {
        if (state.user) {
          users.push({ id: clientId.toString(), ...state.user });
        }
      });
      setActiveUsers(users);
    };

    // Attach listener for awareness changes
    provider.awareness!.on("change", updateUsers);
    
    // Initial sync
    updateUsers();

    initialized.current = true;

    return () => {
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, []); // Note: Keep dependencies minimal to avoid re-initialization
}
