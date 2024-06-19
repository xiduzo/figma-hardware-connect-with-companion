"use client";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export function Content() {
  const [contents, setContents] = useState("");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xiduzo/figma-hardware-connect-with-companion/main/README.md",
    )
      .then((response) => response.text())
      .then((text) => setContents(text))
      .catch((error) => console.error(error));
  }, []);

  return <Markdown>{contents}</Markdown>;
}
