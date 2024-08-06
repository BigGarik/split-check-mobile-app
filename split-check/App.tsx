import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import RootLayout from "@/app/_layout";

export default function App() {
  return (
    <NavigationContainer>
      <RootLayout />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
