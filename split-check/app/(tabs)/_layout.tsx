import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Index from './index';
import BillDetails from "@/app/(tabs)/BillDetails/BillDetails";
import ProfileScreen from "@/app/(tabs)/ProfileScreen";
import ShareScreen from '@/app/(tabs)/ShareScreen';
import UserHistory from './UserHistory';

export type RootStackParamList = {
  Index: undefined;
  BillDetails: { data: { position: number; name: string; quantity: number; price: number; sum: number }[]; total: number };
  UserHistory: undefined;
  Profile: undefined;
};

type TabParamList = {
  Home: undefined;
  Share: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
      <Stack.Screen name="BillDetails" component={BillDetails} options={{ headerShown: false }}/>
      <Stack.Screen name="UserHistory" component={UserHistory} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  return (
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
  );
}