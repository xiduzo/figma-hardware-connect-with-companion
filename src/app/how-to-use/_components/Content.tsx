"use client";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Text, Title } from "~/common/components";

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

  return (
    <Markdown
      components={{
        h1: ({ children }) => <Title>{children}</Title>,
        h2: ({ children }) => <Title as="h2">{children}</Title>,
        h3: ({ children }) => <Title as="h3">{children}</Title>,
        h4: ({ children }) => <Title as="h4">{children}</Title>,
        h5: ({ children }) => <Title as="h5">{children}</Title>,
        h6: ({ children }) => <Title as="h6">{children}</Title>,
        p: ({ children }) => <Text>{children}</Text>,
        pre: ({ children }) => {
          const { props } = children as {
            props: { children: string; className?: string };
          };
          const code = props.children;
          const language = props.className?.replace("language-", "");
          return (
            <SyntaxHighlighter
              style={a11yDark}
              language={language}
              customStyle={{
                overflow: "visible",
              }}
            >
              {code}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {contents}
    </Markdown>
  );
}
