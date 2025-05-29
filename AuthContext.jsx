import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Criando o contexto de autenticação
const AuthContext = createContext();

// URL base da API
const API_URL = 'http://localhost:5000/api';

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurar o axios com o token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/profile`);
        setUser(res.data.user);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setToken(null);
        setUser(null);
        setError('Sessão expirada. Por favor, faça login novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Função para login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      setToken(res.data.token);
      setUser(res.data.user);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError(err.response?.data?.message || 'Erro ao registrar. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Função para atualizar perfil
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/auth/profile`, userData);
      setUser(res.data.user);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para alterar senha
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      setError(err.response?.data?.message || 'Erro ao alterar senha. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isOrganizer: user?.role === 'organizer' || user?.role === 'admin',
        isSecurity: user?.role === 'security' || user?.role === 'organizer' || user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
