import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "@/app/(tabs)/_layout";
import { useAuth } from "@/app/(tabs)/BillDetails/Utilities/AuthContext";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { token, login } = useAuth();
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (token) {
            console.log('User is logged in with token:', token);
        } else {
            console.log('User is not logged in');
        }
    }, [token]);

    const validateInputs = () => {
        if (!username.trim()) {
            setLoginError('Username is required');
            return false;
        }
        if (!password.trim()) {
            setLoginError('Password is required');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        setLoginError('');
        if (!validateInputs()) return;

        try {
            const formBody = new URLSearchParams();
            formBody.append('username', username.trim());
            formBody.append('password', password.trim());

            const response = await fetch('https://biggarik.ru/split_check/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody.toString(),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                if (responseData.token) {
                    await login(responseData.token);
                    Alert.alert('Success', `Login successful! Token: ${responseData.token}`);
                    navigation.navigate('UserHistory');
                } else {
                    setLoginError('Login successful, but no token received.');
                }
            } else {
                let errorMessage = 'Login failed. ';
                if (response.status === 422) {
                    errorMessage += 'Invalid input data. Please check your username and password.';
                } else {
                    errorMessage += responseData.message || `Status: ${response.status}`;
                }
                setLoginError(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('An error occurred. Please check your internet connection and try again.');
        }
    };

    const handleLogout = () => {
        // logout();
        Alert.alert('Success', 'You have been logged out');
    };

    if (token) {
        // User logged in
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome, User!</Text>
                <View style={styles.tokenContainer}>
                    <Text style={styles.tokenTitle}>Current Token:</Text>
                    <Text style={styles.tokenText}>{token}</Text>
                </View>
                <Button title="View My History" onPress={() => navigation.navigate('UserHistory')} />
                <Button title="Logout" onPress={handleLogout} />
            </View>
        );
    }

    // User not logged in
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.loginContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Button title="Login" onPress={handleLogin} />
                {loginError ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{loginError}</Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    loginContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
        color : 'grey'
    },
    tokenContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    tokenTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tokenText: {
        fontSize: 16,
        marginTop: 5,
    },
    errorContainer: {
        backgroundColor: '#ffcccb',
        borderColor: '#ff0000',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
    },
    errorText: {
        color: '#ff0000',
        textAlign: 'center',
    },
});