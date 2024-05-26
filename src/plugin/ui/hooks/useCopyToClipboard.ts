import { useEffect, useState } from "react";

export function useCopyToClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  function copyFunction(valueToCopy: string) {
    setCopiedValue(valueToCopy);
    if ("clipboard" in navigator) {
      void navigator.clipboard.writeText(valueToCopy);
      return;
    }

    if ("copy" in window) {
      // @ts-expect-error ignore TS error
      void window.copy(valueToCopy);
      return;
    }

    // This is very hacky, but it works
    // Sue me
    const area = document.createElement("textarea");
    document.body.appendChild(area);
    area.value = valueToCopy;
    area.focus();
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
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
