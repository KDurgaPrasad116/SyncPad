import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { QuillBinding } from "y-quill";
import Quill from "quill";

import { WS_URL } from "../utils/constants";

export function createCollaborationSession(
  roomCode: string,
  userName: string,
  color: string,
  quill: Quill
) {
  const ydoc = new Y.Doc();

  const provider = new HocuspocusProvider({
    url: WS_URL,
    name: `secure-workspace-${roomCode}`,
    document: ydoc,
  });

  provider.awareness!.setLocalStateField("user", {
    name: userName,
    color,
  });

  const binding = new QuillBinding(
    ydoc.getText("quill"),
    quill,
    provider.awareness!
  );

  return {
    ydoc,
    provider,
    binding,
    chatArray: ydoc.getArray("chat"),
  };
}