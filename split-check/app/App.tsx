import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from "@/app/(tabs)/BillDetails/Utilities/AuthContext";
import RootLayout from "@/app/(tabs)/_layout";

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <RootLayout/>
            </NavigationContainer>
        </AuthProvider>
    );
}