"use client";
import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  // console.log("Session data in AuthProvider:", session, status);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const storeDataOnLogin = useCallback((userData) => {
    if (!userData) {
      setUserInfo(null);
      return;
    }

    setUserInfo(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const clearDataOnLogout = useCallback(() => {
    // clear user info and specific localStorage items on logout
    setUserInfo(null);
    localStorage.removeItem("user");
  }, []);

  const loadFromStorage = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUserInfo(JSON.parse(stored));
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("user");
        }
      }
    }
  };

  // Initialize from localStorage on mount - runs once
  useEffect(() => {
    loadFromStorage();
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLoading,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
