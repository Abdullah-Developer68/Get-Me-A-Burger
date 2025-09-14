"use client";
import { createContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { store } from "@/redux/store";
import { set } from "mongoose";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  // console.log("Session data in AuthProvider:", session, status);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const storeDataOnLogin = (userData) => {
    if (!userData) {
      setUserInfo(null);
      return;
    }

    setUserInfo(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("username", userData.username);
    localStorage.setItem("profilePic", userData.profilePic || "");
    localStorage.setItem("coverPic", userData.coverPic || "");
  };

  const clearDataOnLogout = () => {
    // clear user info and specific localStorage items on logout
    setUserInfo(null);
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("coverPic");
  };

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
  }, []);

  // Handle session changes - depend on session, not userInfo
  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      storeDataOnLogin(session.user);
    } else if (status === "unauthenticated") {
      clearDataOnLogout();
    }
    setIsLoading(false);
  }, [session, status]);

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        storeDataOnLogin,
        clearDataOnLogout,
        loadFromStorage,
        isLoading,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
