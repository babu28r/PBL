import React, { createContext, useState, useContext, useEffect } from 'react';

// Mock user data for development
const mockUser = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin'
};

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (mock implementation)
    const token = localStorage.getItem('token');
    if (token) {
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@example.com' && password === 'admin123') {
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);
        setUser(mockUser);
        return { success: true, user: mockUser };
      } else {
        return { 
          success: false, 
          error: 'Invalid credentials. Use admin@example.com / admin123' 
        };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};