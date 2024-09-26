import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        loadToken();
    }, []);

    const loadToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('userToken');
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error('Failed to load token', error);
        }
    };

    const login = async (newToken) => {
        try {
            await AsyncStorage.setItem('userToken', newToken);
            setToken(newToken);
        } catch (error) {
            console.error('Failed to save token', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setToken(null);
        } catch (error) {
            console.error('Failed to remove token', error);
        }
    };

    const authContext = {
        token,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};