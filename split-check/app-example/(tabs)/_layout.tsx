import {Tabs} from 'expo-router';
import React from 'react';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, focused}) => (
                        <AntDesign name="home" size={24} color="black" />
                    ),
                }}
            />

            <Tabs.Screen
                name="ProfileScreen"

                options={{
                    title: 'Profile',
                    tabBarIcon: ({color, focused}) => (
                        <AntDesign name="user" size={24} color="black" />
                    ),
                }}
            />


        </Tabs>
    );
}
