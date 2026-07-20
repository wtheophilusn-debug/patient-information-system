import { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pisUser') || 'null');
      if (!stored?.token) return null;
      // Check token expiry
      const payload = JSON.parse(atob(stored.token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('pisUser');
        return null;
      }
      return stored;
    } catch { return null; }
  });

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('pisUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('pisUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
