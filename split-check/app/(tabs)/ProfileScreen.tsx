import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "@/app/(tabs)/_layout";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const validateInputs = () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Username is required');
            return false;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Password is required');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
        const formBody = new URLSearchParams();
        formBody.append('username', username.trim());
        formBody.append('password', password.trim());

        const response = await fetch('/token', {
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
                setToken(responseData.token);
                Alert.alert('Success', `Login successful! Token: ${responseData.token}`);
            } else {
                Alert.alert('Warning', 'Login successful, but no token received.');
            }
        } else {
            let errorMessage = 'Login failed. ';
            if (response.status === 422) {
                errorMessage += 'Invalid input data. Please check your username and password.';
            } else {
                errorMessage += responseData.message || `Status: ${response.status}`;
            }
            Alert.alert('Error', errorMessage);
        }
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', 'An error occurred. Please check your internet connection and try again.');
    }
};


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Screen</Text>

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
            </View>

            {token ? (
                <View style={styles.tokenContainer}>
                    <Text style={styles.tokenTitle}>Current Token:</Text>
                    <Text style={styles.tokenText}>{token}</Text>
                </View>
            ) : null}

            <Button title="View My History" onPress={() => navigation.navigate('UserHistory')} />
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
});