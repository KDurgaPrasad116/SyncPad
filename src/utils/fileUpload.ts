import { MAX_FILE_SIZE } from "./constants";

export function handleFileUpload(
  event: React.ChangeEvent<HTMLInputElement>,
  userName: string,
  chatArrayRef: React.MutableRefObject<any>
) {
  const file = event.target.files?.[0];

  if (!file || !chatArrayRef.current) return;

  if (file.size > MAX_FILE_SIZE) {
    alert("File under 2MB please.");
    return;
  }

  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onloadend = () => {
    chatArrayRef.current.push([
      {
        id: Date.now().toString(),
        sender: userName,
        type: "file",
        fileName: file.name,
        content: reader.result,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };
}