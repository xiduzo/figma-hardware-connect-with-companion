"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    httpBatchLink,
    loggerLink,
    unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import React, { useEffect, useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "~/server/api/root";

const createQueryClient = () => new QueryClient();

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

let token: string | undefined | null = undefined;

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  source: string;
  accessToken?: string | null;
}) {
  const queryClient = getQueryClient();

  const [trpcClient, setTrpcClient] = useState<
    ReturnType<typeof api.createClient> | undefined
  >();

  useEffect(() => {
    token = props.accessToken;
  }, [props.accessToken]);

  useEffect(() => {
    const batchLink = ["figma-ui"].includes(props.source)
      ? httpBatchLink
      : unstable_httpBatchStreamLink;

    const client = api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        batchLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", props.source + "foo");
            headers.set("Content-Type", "application/json");
            if (token) headers.set("Authorization", token);

            return headers;
          },
        }),
      ],
    });

    setTrpcClient(client);
  }, [props.source, props.accessToken]);

  if (!trpcClient) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  // return "https://figma-hardware-bridge.vercel.app"

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
