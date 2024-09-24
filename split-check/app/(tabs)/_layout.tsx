import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Index from './index';
import BillDetails from '@/app/(tabs)/BillDetails';
import Profile from '@/app/(tabs)/profile';
import ShareScreen from '@/app/(tabs)/ShareScreen';
import UserHistory from './UserHistory';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

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
        component={Profile}
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