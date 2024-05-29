import React, { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { IconButton } from "~/common/components";

export function CopyIconButton({ text }: { text: string }) {
  const [, copy] = useCopyToClipboard();
  const [hasCopied, setHasCopied] = useState(false);

  async function handleClicked() {
    setHasCopied(await copy(text));

    setTimeout(() => setHasCopied(false), 500);
  }

  return (
    <IconButton
      icon={hasCopied ? "ClipboardDocumentCheckIcon" : "ClipboardDocumentIcon"}
      intent={hasCopied ? "success" : "none"}
      className={`opacity-60 transition-opacity duration-75 hover:opacity-100 ${hasCopied ? "" : "cursor-copy"}`}
      onClick={handleClicked}
    />
  );
}
