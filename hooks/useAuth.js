import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

const useAuth = () => {
  if (!AuthContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return useContext(AuthContext);
};

export default useAuth;
