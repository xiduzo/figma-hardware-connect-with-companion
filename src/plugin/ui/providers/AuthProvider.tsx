import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { trpc } from "../trpc";

const AuthContext = createContext({
  auth: (): Promise<void> => {
    throw new Error("Not implemented");
  },
  isAuthenticating: false,
});

export function AuthProvider({ children }: PropsWithChildren) {
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
  }, [tokens]);

  return (
    <AuthContext.Provider value={{ auth, isAuthenticating: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
