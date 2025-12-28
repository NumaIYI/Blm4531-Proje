import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5028/api';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
 
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [isLoading, setIsLoading] = useState(false);


    const protectedAxios = axios.create({
        baseURL: API_BASE_URL,
    });


    protectedAxios.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );


    protectedAxios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.error("Token geçersiz veya yetkisiz eriþim. Otomatik çýkýþ yapýlýyor.");
               
                logout();
            }
            return Promise.reject(error);
        }
    );

    
    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });

            const { token, role, fullName, userId } = response.data;


            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ userId, fullName, role, username }));

            setToken(token);
            setUser({ userId, fullName, role, username });
            setIsAuthenticated(true);

            return response.data;
        } catch (error) {
            console.error('Giriþ baþarýsýz:', error.response?.data || error.message);
           
            throw new Error(error.response?.data || 'Giriþ sýrasýnda bir hata oluþtu.');
        } finally {
            setIsLoading(false);
        }
    };

    
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

  
    const value = {
        token,
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        protectedAxios, 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};