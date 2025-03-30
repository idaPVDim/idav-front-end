import { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  userRole: string;
}

export const AuthContext = createContext<AuthContextType>({ userRole: 'Client' });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState('Client');

  useEffect(() => {
    // Simuler la récupération du rôle depuis une API ou le stockage local
    const storedRole = localStorage.getItem('userRole') || 'Client';
    setUserRole(storedRole);
  }, []);

  return <AuthContext.Provider value={{ userRole }}>{children}</AuthContext.Provider>;
};