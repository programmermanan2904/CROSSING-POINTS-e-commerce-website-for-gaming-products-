import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 🔥 Restore automatically on refresh
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 🔥 Login (used for both login & register)
  const login = ({ user, token }) => {
    const userData = {
      ...user,
      token,
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

// Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};