import React from "react";

import { useCopyToClipboard } from "../hooks";
import { IconButton } from "./";

export function CopyIconButton({
  textToCopy,
  text,
}: {
  textToCopy: string;
  text?: string;
}) {
  const [hasCopied, copy] = useCopyToClipboard();

  async function handleClicked() {
    await copy(textToCopy);
  }

  return (
    <IconButton
      icon={hasCopied ? "ClipboardDocumentCheckIcon" : "ClipboardDocumentIcon"}
      text={text}
      intent={hasCopied ? "success" : "none"}
      className={`opacity-60 transition-opacity duration-75 hover:opacity-100 ${hasCopied ? "" : "cursor-copy"}`}
      onClick={handleClicked}
    />
  );
}
