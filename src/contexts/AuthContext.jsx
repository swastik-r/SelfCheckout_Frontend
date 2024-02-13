import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuthContext() {
   return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [isGuest, setIsGuest] = useState(true);

   const value = {
      user,
      setUser,
      isGuest,
      setIsGuest,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
