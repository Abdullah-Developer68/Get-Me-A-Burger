"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // when ever a re-render happens the function is re-created with a new memory
  // address. If we know that we do not want a specific funtion to be created again
  // on every re-render we can freeze it using useCallback on recreate with only
  // when specific dependencies change. Here, since there are no dependencies the function will be created only once.
  const storeDataOnLogin = useCallback((userData) => {
    console.log(userData);
    if (!userData) {
      setUserInfo(null);
      localStorage.removeItem("user");
      return;
    }
    // update only if any of the fields have actually changed
    setUserInfo((prev) => {
      if (
        !prev ||
        prev.name !== userData.name ||
        prev.email !== userData.email ||
        prev.image !== userData.image ||
        prev.username !== userData.username ||
        prev.profilePic !== userData.profilePic ||
        prev.coverPic !== userData.coverPic
      ) {
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
      return prev;
    });
  }, []);

  const clearDataOnLogout = useCallback(() => {
    setUserInfo(null);
    localStorage.removeItem("user");
  }, []);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      storeDataOnLogin(session.user);
    }
  }, [status, session, storeDataOnLogin]);

  useEffect(() => {
    loadFromStorage();
    setIsLoading(false);
  }, [loadFromStorage]);

  return (
    <AuthContext.Provider value={{ userInfo, isLoading, status }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
