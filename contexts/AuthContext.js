"use client";
import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  // console.log("Session data in AuthProvider:", session, status);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitializedFromStorage = useRef(false);

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
    hasInitializedFromStorage.current = true;
    setIsLoading(false);
  }, []);

  // Handle session changes - only update on fresh login, not refresh
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      // Only update if we haven't initialized from storage yet (fresh login)
      // On page refresh, hasInitializedFromStorage will be true, so don't overwrite
      if (!hasInitializedFromStorage.current || !userInfo) {
        storeDataOnLogin(session.user);
        hasInitializedFromStorage.current = true;
      }
    } else if (status === "unauthenticated") {
      clearDataOnLogout();
      hasInitializedFromStorage.current = false;
    }
  }, [status, session?.user, userInfo, clearDataOnLogout, storeDataOnLogin]); // Include all dependencies

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
