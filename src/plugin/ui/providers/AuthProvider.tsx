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

type AuthContext = {
  auth: () => Promise<void>;
  isAuthenticating?: boolean;
  user?: {
    id: string;
    email?: string | null;
    image?: string | null;
    name?: string | null;
  };
};

const AuthContext = createContext<AuthContext>({
  auth: (): Promise<void> => {
    throw new Error("Not implemented");
  },
});

type Tokens = RouterOutputs["auth"]["getAccessToken"];

export function AuthProvider({ children }: PropsWithChildren) {
  const [localTokens, setLocalTokens] = useLocalStorage<Tokens>(
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

  const { data: user } = trpc.auth.me.useQuery(undefined, {
    enabled: !!localTokens?.accessToken,
  });

  const { data: tokens, status } = trpc.auth.getAccessToken.useQuery(
    data?.read ?? "",
    {
      enabled: !!refetchInterval,
      refetchInterval,
    },
  );

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

  console.log({ user });

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticating: data !== undefined && status !== "success",
        user: user?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
