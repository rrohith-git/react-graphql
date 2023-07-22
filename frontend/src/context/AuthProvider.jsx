import React, { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import AuthContext from "./auth-context";


const getLoginData = () => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    const userId = localStorage.getItem('userId');
    return { token, expirationTime, userId };
}

const getDuration = (expirationTime) => {
    const expirationDate = new Date(expirationTime * 1000);
    const duration = expirationDate.getTime() - new Date().getTime();
    return duration;
}

let timeout

const AuthProvider = ({ children }) => {

    const tokenData = getLoginData();
    let initalTokenData
    if (tokenData.token) {
        initalTokenData = tokenData
    }
    const [loginData, setLoginData] = useState({
        token: initalTokenData ? initalTokenData.token : null,
        userId: initalTokenData ? initalTokenData.userId : null
    });

    useEffect(() => {
        if (tokenData.expirationTime) {
            const duration = getDuration(tokenData.expirationTime);
            timeout = setTimeout(() => {
                onLogoutHandler()
            }, duration);
        }
        return () => timeout && clearTimeout(timeout);
    }, [tokenData]);

    const onLoginHandler = ({ token, userId }) => {
        setLoginData({ token, userId });
        const decodedToken = jwt(token);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationTime', decodedToken.exp);
        const duration = getDuration(decodedToken.exp);
        setTimeout(() => {
            onLogoutHandler()
        }, duration);
    };

    const onLogoutHandler = () => {
        setLoginData({ token: null, userId: null });
        localStorage.clear();
    };

    const authContext = {
        token: loginData.token,
        userId: loginData.userId,
        login: onLoginHandler,
        logout: onLogoutHandler,
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
