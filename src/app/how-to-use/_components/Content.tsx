"use client";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from "remark-gfm";

import { Text, Title } from "~/common/components";

export function Content() {
  const [contents, setContents] = useState("");

  console.log({ contents });
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
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <Title>{children}</Title>,
        h2: ({ children }) => (
          <Title as="h2" className="pt-8">
            {children}
          </Title>
        ),
        h3: ({ children }) => (
          <Title as="h3" className="pt-6">
            {children}
          </Title>
        ),
        h4: ({ children }) => (
          <Title as="h4" className="pt-4">
            {children}
          </Title>
        ),
        h5: ({ children }) => (
          <Title as="h5" className="pt-2">
            {children}
          </Title>
        ),
        h6: ({ children }) => (
          <Title as="h6" className="pt-1">
            {children}
          </Title>
        ),
        p: ({ children }) => <Text>{children}</Text>,
        li: ({ children }) => <Text as="li">{children}</Text>,
        ol: ({ children }) => (
          <ol className="list-inside list-decimal">{children}</ol>
        ),
        table: ({ children }) => (
          <table className="border text-white">{children}</table>
        ),
        td: ({ children }) => (
          <td className="border p-2 text-white">{children}</td>
        ),
        th: ({ children }) => (
          <th className="border p-2 text-white">{children}</th>
        ),
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noreferrer" className="underline">
            {children}
          </a>
        ),
        pre: ({ children }) => {
          const { props } = children as {
            props: { children: string; className?: string };
          };
          const code = props.children;
          let language = props.className?.replace("language-", "");

          if (
            language === "cpp" &&
            (code.includes("void setup()") || code.includes("void loop()"))
          ) {
            language = "arduino";
          }

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
