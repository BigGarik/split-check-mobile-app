import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Index from './index';
import CameraScreen from "@/app/(tabs)/Camera/CameraScreen";
import BillDetails from "@/app/(tabs)/BillDetails/BillDetails";
import ProfileScreen from "@/app/(tabs)/Profile/ProfileScreen";
import ShareScreen from '@/app/(tabs)/ShareScreen';
import UserHistory from './Profile/UserHistory';
import { AuthProvider } from "@/app/(tabs)/BillDetails/Utilities/AuthContext";

export type RootStackParamList = {
    Index: undefined;
    CameraScreen: undefined;
    BillDetails: {
        data: { position: number; name: string; quantity: number; price: number; sum: number }[];
        total: number;
        restaurantInfo: {
            name: string;
            tableNumber: string;
            orderNumber: string;
            date: string;
            time: string;
            waiter: string;
        };
        serviceCharge: {
            name: string;
            amount: number;
        };
        vat: {
            rate: number;
            amount: number;
        };
    };
    UserHistory: undefined;
    Profile: undefined;
};

type TabParamList = {
    Home: undefined;
    Share: undefined;
    Profile: undefined;
    Camera : undefined
};

const Stack = createStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function HomeStack() {
    return (
        <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BillDetails" component={BillDetails} options={{ headerShown: false }} />
            <Stack.Screen name="UserHistory" component={UserHistory} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <Tabs.Navigator>
                <Tabs.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                        ),
                        headerShown: false
                    }}
                />
                <Tabs.Screen
                    name="Share"
                    component={ShareScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name={focused ? 'share-social-outline' : 'share-social-outline'} size={size} color={color} />
                        ),
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="Camera"
                    component={HomeStack}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name={focused ? 'camera' : 'camera-outline'} size={size} color={color} />
                        ),
                        headerShown: false
                    }}
                />
                <Tabs.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
                        ),
                        headerShown: false
                    }}
                />
            </Tabs.Navigator>
        </AuthProvider>
    );
}