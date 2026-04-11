/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useEffect, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId && token) {
            setCurrUser({ userId, token });
        }
    }, []); 

    const login = (userId, token) => {
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        setCurrUser({ userId, token });
    };

    const logout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        setCurrUser(null);
    };

    const value = {
        currUser,
        setCurrUser,
        login,    // added
        logout    // added
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};