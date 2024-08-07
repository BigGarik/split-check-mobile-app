import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootLayout from '@/app/(tabs)/_layout';

export default function App() {
  console.log('Rendering App and setting up NavigationContainer');

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootLayout />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
