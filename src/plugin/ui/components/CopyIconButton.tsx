import React from "react";

import { useCopyToClipboard } from "../hooks";
import { IconButton } from "./";

export function CopyIconButton({ text }: { text: string }) {
  const [copiedValue, copy] = useCopyToClipboard();

  async function handleClicked() {
    await copy(text);
  }

  return (
    <IconButton
      icon={
        copiedValue ? "ClipboardDocumentCheckIcon" : "ClipboardDocumentIcon"
      }
      intent={copiedValue ? "success" : "none"}
      className={`opacity-60 transition-opacity duration-75 hover:opacity-100 ${copiedValue ? "" : "cursor-copy"}`}
      onClick={handleClicked}
    />
  );
}
