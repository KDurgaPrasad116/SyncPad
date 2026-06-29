import { createContext, useContext } from "react";
import type { ChatMessage } from "../types/chat";

interface ChatContextType {
  messages: ChatMessage[];

  chatInput: string;

  setChatInput: React.Dispatch<
    React.SetStateAction<string>
  >;

  sendMessage: () => void;

  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const ChatContext =
  createContext<ChatContextType | null>(null);

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChatContext must be used inside ChatContext.Provider"
    );
  }

  return context;
}