import React, { createContext, useEffect, type PropsWithChildren } from "react";
import { type RouterOutputs } from "../../../trpc/react";
import { Button } from "../components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { trpc } from "../trpc";
import { LOCAL_STORAGE_KEYS } from "../types";

type AuthContext = {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticating?: boolean;
  user?: {
    id: string;
    email?: string | null;
    image?: string | null;
    name?: string | null;
    uid?: string | null;
  };
};

const AuthContext = createContext<AuthContext>({
  signIn: (): Promise<void> => {
    throw new Error("Not implemented");
  },
  signOut: (): Promise<void> => {
    throw new Error("Not implemented");
  },
});

type Tokens = RouterOutputs["auth"]["getAccessToken"];

export function AuthProvider({ children }: PropsWithChildren) {
  const utils = trpc.useUtils();
  const [localTokens, setLocalTokens] = useLocalStorage<Tokens>(
    LOCAL_STORAGE_KEYS.AUTH_TOKENS,
  );

  const {
    data: readWriteKeys,
    mutateAsync: createReadWriteKeys,
    reset: clearReadWriteKeys,
  } = trpc.auth.createReadWriteKeys.useMutation();

  const { data: user, refetch: refetchUser } = trpc.auth.me.useQuery(
    undefined,
    {
      enabled: !!localTokens?.accessToken,
      retry: false,
    },
  );

  const { data: tokens, status: getAccessTokenStatus } =
    trpc.auth.getAccessToken.useQuery(readWriteKeys?.read ?? "", {
      enabled: !!readWriteKeys,
      refetchInterval: 1000,
    });

  async function signIn() {
    await createReadWriteKeys();
  }

  async function signOut() {
    await setLocalTokens(undefined);
    await utils.auth.me.reset();
  }

  useEffect(() => {
    if (!readWriteKeys?.write) return;

    window.open(
      `http://localhost:3000/api/auth/signin?figma-write-key=${readWriteKeys.write}`,
      "_blank",
    );

    // TODO
    // set a timeout to clear readWriteKeys if the user doesn't sign in
    // this will unblock the UI again
  }, [readWriteKeys?.write]);

  useEffect(() => {
    if (!tokens?.accessToken) return;
    clearReadWriteKeys(); // prevent re-fetching tokens
    void setLocalTokens(tokens);
    void refetchUser();
  }, [tokens, setLocalTokens, clearReadWriteKeys, refetchUser]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isAuthenticating:
          readWriteKeys !== undefined && getAccessTokenStatus !== "success",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);

export function AuthButton({ signInText }: { signInText?: string }) {
  const { signIn, signOut, user, isAuthenticating } = useAuth();

  if (user) {
    return (
      <Button intent="danger" onClick={signOut}>
        Sign out
      </Button>
    );
  }

  if (isAuthenticating) {
    return (
      <Button intent="info" disabled>
        Waiting for sign in response...
      </Button>
    );
  }

  return (
    <Button intent="info" onClick={signIn} disabled={isAuthenticating}>
      {signInText ?? "Sign in"}
    </Button>
  );
}
