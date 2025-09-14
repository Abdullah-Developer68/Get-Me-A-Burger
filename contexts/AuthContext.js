import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("user") || null
  );

  const getUserData = async () => {
    try {
      const res = await fetch(
        `/app/api/user/data/?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      setUserInfo(data.user);

      // save the data to local storage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("profilePic", data.user.profilePic);
      localStorage.setItem("coverPic", data.user.coverPic);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // clear local storage on error
      setUserInfo(null);
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("profilePic");
      localStorage.removeItem("coverPic");
    }
  };

  // fetch new details when username changes
  useEffect(() => {
    // remove previous user details from local storage
    localStorage.clear();
    getUserData();
  }, [userInfo.user.username]);

  return (
    <AuthContext value={{ userInfo, getUserData }}>{children}</AuthContext>
  );
};

export { AuthProvider, AuthContext };
