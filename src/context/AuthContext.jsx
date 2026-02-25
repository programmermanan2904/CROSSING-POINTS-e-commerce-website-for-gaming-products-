import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔥 Restore user on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Auth restore error:", error);
    }
  }, []);

  // 🔥 Login (used for BOTH login & register)
  const login = (data) => {
    const userData = {
      ...data.user,
      token: data.token,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔥 Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};