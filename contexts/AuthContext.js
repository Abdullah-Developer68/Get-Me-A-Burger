import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("user") || null
  );

  const getUserData = async () => {
    const res = await fetch("/app/api/user/data/route.js", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setUserInfo(data.user);

    // save the data to local storage
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  // fetch new details when username changes
  useEffect(() => {
    getUserData();
  }, [userInfo.user.username]);

  return (
    <AuthContext value={{ userInfo, getUserData }}>{children}</AuthContext>
  );
};

export default AuthContext;
