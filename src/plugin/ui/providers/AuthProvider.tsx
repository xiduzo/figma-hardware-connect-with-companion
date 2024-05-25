import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { type RouterOutputs } from "../../../trpc/react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { trpc } from "../trpc";
import { LOCAL_STORAGE_KEYS } from "../types";

const AuthContext = createContext({
  auth: (): Promise<void> => {
    throw new Error("Not implemented");
  },
  isAuthenticating: false,
});

type Tokens = RouterOutputs["auth"]["getAccessToken"];

export function AuthProvider({ children }: PropsWithChildren) {
  const [, setLocalTokens] = useLocalStorage<Tokens>(
    LOCAL_STORAGE_KEYS.AUTH_TOKENS,
  );

  const [refetchInterval, setRefetchInterval] = useState<number | undefined>(
    undefined,
  );
  const { data, mutateAsync } = trpc.auth.createReadWriteKeys.useMutation({
    onSuccess: () => {
      setRefetchInterval(1000);
    },
  });

  const { data: tokens } = trpc.auth.getAccessToken.useQuery(data?.read ?? "", {
    enabled: !!refetchInterval,
    refetchInterval,
  });

  async function auth() {
    await mutateAsync();
  }

  useEffect(() => {
    if (!data?.write) return;

    window.open(
      `http://localhost:3000/api/auth/signin?figma-write-key=${data.write}`,
      "_blank",
    );
  }, [data?.write]);

  useEffect(() => {
    if (!tokens?.accessToken) return;

    setRefetchInterval(undefined);
    setLocalTokens(tokens);
  }, [tokens, setLocalTokens]);

  return (
    <AuthContext.Provider value={{ auth, isAuthenticating: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
