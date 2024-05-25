import React, { createContext, type PropsWithChildren } from "react";

const AuthContext = createContext({});

export function AuthProvider({ children }: PropsWithChildren) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
