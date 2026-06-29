import { useState } from "react";
import { handleFileUpload } from "../utils/fileUpload";

export default function useChat(
    userName: string,
    chatArrayRef: React.MutableRefObject<any>,
    pendingAudio: string | null,
    setPendingAudio: (audio: string | null) => void
) {
    const [chatInput, setChatInput] = useState("");

    const sendMessage = () => {

        if (pendingAudio && chatArrayRef.current) {

            chatArrayRef.current.push([{
                id: Date.now().toString(),
                sender: userName,
                type: "audio",
                content: pendingAudio,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }]);

            setPendingAudio(null);
        }

        if (chatInput.trim() && chatArrayRef.current) {

            chatArrayRef.current.push([{
                id: Date.now().toString(),
                sender: userName,
                type: "text",
                content: chatInput,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }]);

            setChatInput("");
        }
    };

    const uploadFile = (
  event: React.ChangeEvent<HTMLInputElement>
        ) => {
        handleFileUpload(event, userName, chatArrayRef);
        };

    return {
        chatInput,
        setChatInput,
        sendMessage,
        handleFileUpload: uploadFile,
        };
}