import { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  userRole: string;
  logout: () => void; // Add the logout method
}

export const AuthContext = createContext<AuthContextType>({
  userRole: 'Client',
  logout: () => {}, // Provide a default no-op function for logout
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState('Client');

  useEffect(() => {
    // Simuler la récupération du rôle depuis une API ou le stockage local
    const storedRole = localStorage.getItem('userRole') || 'Client';
    setUserRole(storedRole);
  }, []);

  const logout = () => {
    localStorage.removeItem('userRole');
    setUserRole('Client');
  };

  return <AuthContext.Provider value={{ userRole, logout }}>{children}</AuthContext.Provider>;
};