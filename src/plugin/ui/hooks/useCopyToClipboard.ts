import { useEffect, useState } from "react";
import { ShowToast } from "../types";
import { sendMessageToFigma } from "../utils";

export function useCopyToClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  function copyFunction(valueToCopy: string) {
    if ("clipboard" in navigator) {
      return navigator.clipboard
        .writeText(valueToCopy)
        .then(() => {
          setCopiedValue(valueToCopy);
        })
        .catch(console.error);
    }

    if ("copy" in window) {
      // @ts-expect-error ignore TS error
      void window.copy(valueToCopy);
      setCopiedValue(valueToCopy);
      return;
    }

    // This is very hacky, but it works
    // Sue me
    const area = document.createElement("textarea");
    document.body.appendChild(area);
    area.value = valueToCopy;
    area.focus();
    area.select();
    const success = document.execCommand("copy");
    document.body.removeChild(area);
    if (success) {
      setCopiedValue(valueToCopy);
      return;
    }

    sendMessageToFigma(
      ShowToast("Unabled to copy to clipboard", { error: true }),
    );
  }

  useEffect(() => {
    if (!copiedValue) return;

    const timeout = setTimeout(() => {
      setCopiedValue(null);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [copiedValue]);

  return [copiedValue, copyFunction] as const;
}
