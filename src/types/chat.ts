export interface ChatMessage {
  id: string;
  sender: string;
  type: "text" | "audio" | "file";
  content: string;
  timestamp: string;
  fileName?: string;
}

export interface ActiveUser {
  id: string;
  name: string;
  color: string;
}