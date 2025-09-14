"use client";
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize userInfo from localStorage on mount
  useEffect(() => {
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
      setIsLoading(false);
    }
  }, []);

  const getUserData = async (username) => {
    if (!username) return;

    try {
      const res = await fetch(
        `/api/user/data/?username=${encodeURIComponent(username)}`, // Fixed API path
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.user) {
        setUserInfo(data.user);
        // save the data to local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("profilePic", data.user.profilePic || "");
        localStorage.setItem("coverPic", data.user.coverPic || "");
      } else {
        console.error("User data not found in response");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const storeDataOnLogin = (userData) => {
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

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        getUserData,
        storeDataOnLogin,
        clearDataOnLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
