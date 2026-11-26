
import {
  createContext,
  useContext,
  useState,
} from "react";
import api, {
  getAccessToken,
  getRefreshToken,
  clearAuthTokens,
} from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // An in-memory token does not survive a full page reload.
    if (!getAccessToken()) {
      sessionStorage.removeItem("dentalcare_user");
      return null;
    }

    try {
      const savedUser = sessionStorage.getItem("dentalcare_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      sessionStorage.removeItem("dentalcare_user");
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem(
      "dentalcare_user",
      JSON.stringify(userData)
    );
  };

  const logout = async () => {
    const token = getRefreshToken();
    try {
      if (token) {
        await api.post("/auth/revoke-token", {
          refreshToken: token,
        });
      }
    } catch (error) {
      console.error("Server logout failed:", error);
    } finally {
      clearAuthTokens();
      sessionStorage.removeItem("dentalcare_user");
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: Boolean(user && getAccessToken()),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};
