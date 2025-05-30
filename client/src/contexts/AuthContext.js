import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${config.API_URL}/api/auth/verify`);
          setUser(response.data.user);
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    // Demo mode credentials (works without backend)
    const demoCredentials = {
      'admin@fitnessma.ma': { password: 'admin123', role: 'admin', name: 'Admin FitnessMA' },
      'coach@fitnessma.ma': { password: 'coach123', role: 'coach', name: 'Coach Demo' },
      'client@fitnessma.ma': { password: 'client123', role: 'client', name: 'Client Demo' }
    };

    // Check demo credentials first
    if (demoCredentials[email] && demoCredentials[email].password === password) {
      const demoUser = {
        id: 1,
        email: email,
        firstName: demoCredentials[email].name.split(' ')[0],
        lastName: demoCredentials[email].name.split(' ')[1] || '',
        role: demoCredentials[email].role
      };
      
      const demoToken = 'demo_token_' + Date.now();
      
      setToken(demoToken);
      setUser(demoUser);
      localStorage.setItem('token', demoToken);
      localStorage.setItem('demoMode', 'true');
      
      return { success: true, user: demoUser };
    }

    // Try backend login if demo credentials don't match
    try {
      const response = await axios.post(`${config.API_URL}/api/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('demoMode', 'false');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Identifiants incorrects. Utilisez les comptes de démonstration ou déployez le backend.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${config.API_URL}/api/auth/register`, userData);
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCoach: user?.role === 'coach',
    isClient: user?.role === 'client'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 