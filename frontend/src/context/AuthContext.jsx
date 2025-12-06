import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                email,
                password,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const signup = async (name, email, password, role, githubUsername) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
                name,
                email,
                password,
                role,
                githubUsername,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const setUserFromOAuth = (userInfo) => {
        setUser(userInfo);
    };

    const updateUser = (updatedUserData) => {
        const updatedUser = { ...user, ...updatedUserData };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, setUserFromOAuth, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
