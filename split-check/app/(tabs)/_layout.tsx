import React, {useCallback, useEffect, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, NavigationState } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Index from './index';
import CameraScreen from "@/app/(tabs)/Camera/CameraScreen";
import BillDetails from "@/app/(tabs)/BillDetails/BillDetails";
import ProfileScreen from "@/app/(tabs)/Profile/ProfileScreen";
import UserHistory from './Profile/UserHistory';
import { AuthProvider } from "@/app/(tabs)/BillDetails/Utilities/AuthContext";
import * as Sharing from 'expo-sharing';
import {useFocusEffect} from "expo-router";

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
    Camera: undefined;
    Share: undefined;
    Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

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

function TabNavigator() {
    console.log('Rendering TabNavigator');
    const [isBillDetailsVisible, setIsBillDetailsVisible] = useState(false);
    const navigation = useNavigation();

    const checkIfBillDetailsIsVisible = useCallback(() => {
        console.log('Checking if BillDetails is visible');
        const state = navigation.getState();
        //console.log('Navigation state:', JSON.stringify(state, null, 2));

        const isBillDetailsInState = (state: any): boolean => {
            if (state.routes) {
                for (const route of state.routes) {
                    if (route.name === 'BillDetails') {
                        return true;
                    }
                    if (route.state) {
                        if (isBillDetailsInState(route.state)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        const isBillDetails = isBillDetailsInState(state);
        //console.log('Is BillDetails visible:', isBillDetails);
        setIsBillDetailsVisible(isBillDetails);
    }, [navigation]);

    useEffect(() => {
        console.log('Setting up navigation listener');
        const unsubscribe = navigation.addListener('state', () => {
            console.log('Navigation state changed');
            checkIfBillDetailsIsVisible();
        });
        return unsubscribe;
    }, [navigation, checkIfBillDetailsIsVisible]);

    useFocusEffect(
        useCallback(() => {
            console.log('Screen focused');
            checkIfBillDetailsIsVisible();
        }, [checkIfBillDetailsIsVisible])
    );

    // const handleShare = async () => {
    //     console.log('Handle share called');
    //     const state = navigation.getState();
    //     if (state && 'routes' in state && 'index' in state) {
    //         const currentRoute = state.routes[state.index];
    //         const billDetailsRoute = currentRoute.state?.routes?.find(route => route.name === 'BillDetails');
    //         const params = billDetailsRoute?.params as any;
    //
    //         if (params?.data) {
    //             //console.log('Share data:', JSON.stringify(params, null, 2));
    //             const { data, total, restaurantInfo, serviceCharge, vat } = params;
    //
    //             const message = `
    //                 Restaurant: ${restaurantInfo.name}
    //                 Table: ${restaurantInfo.tableNumber}
    //                 Order: ${restaurantInfo.orderNumber}
    //                 Date: ${restaurantInfo.date}
    //                 Time: ${restaurantInfo.time}
    //                 Waiter: ${restaurantInfo.waiter}
    //
    //                 Items:
    //                 ${data.map((item: any) => `${item.name} x${item.quantity} - $${item.sum}`).join('\n')}
    //
    //                 Subtotal: $${total}
    //                 Service Charge: $${serviceCharge.amount}
    //                 VAT (${vat.rate}%): $${vat.amount}
    //                 Total: $${total + serviceCharge.amount + vat.amount}
    //             `;
    //
    //             try {
    //                 const result = await Sharing.isAvailableAsync();
    //                 if (result) {
    //                     await Sharing.shareAsync(message, { dialogTitle: 'Share Bill Details' });
    //                 }
    //             } catch (error) {
    //                 console.error('Error sharing:', error);
    //             }
    //         } else {
    //             console.log('No data to share');
    //         }
    //     } else {
    //         console.log('Invalid state for sharing');
    //     }
    // };

    const handleShare = async () => {
        try {
            await Sharing.shareAsync('https://expo.dev');
            console.log('Shared successfully');
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    console.log('Current isBillDetailsVisible:', isBillDetailsVisible);

    return (
        <AuthProvider>
            <Tabs.Navigator
                 screenOptions={{
                    tabBarStyle: {
                        height: 65,
                        paddingBottom: 5,
                        paddingTop: 5,
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                    },
                    tabBarActiveTintColor: '#3498db',
                    tabBarInactiveTintColor: '#bdc3c7',
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                        marginTop: 1
                    },
                    tabBarItemStyle: {
                        padding: 5,
                    },
                }}>

                <Tabs.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        tabBarIcon: ({ focused, color, size  }) => (
                            <Ionicons name={focused ? 'home' : 'home-outline'} size={30} color={color} />
                        ),
                        //tabBarLabel: '',
                        headerShown: false
                    }}
                />
                <Tabs.Screen
                    name="Back"
                    component={HomeStack}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="arrow-back" size={30} color={color} />
                        ),
                        //tabBarLabel: '',
                        headerShown: false,
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            navigation.goBack();
                        },
                    }}
                />
                {isBillDetailsVisible ? (
                    <Tabs.Screen
                        name="Share"
                        component={HomeStack}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="share-outline" size={30} color={color} />
                            ),
                            //headerShown: false,
                            tabBarLabel: '',
                        }}
                        listeners={{
                            tabPress: (e) => {
                                console.log('Share tab pressed');
                                e.preventDefault();
                                handleShare();
                            },
                        }}
                    />
                ) : (
                    <Tabs.Screen
                        name="Camera"
                        component={CameraScreen}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                                <Ionicons name={focused ? 'camera' : 'camera-outline'} size={30} color={color} />
                            ),
                            headerShown: false,
                            //tabBarLabel: '',
                        }}
                    />
                )}
                <Tabs.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name={focused ? 'person' : 'person-outline'} size={30} color={color} />
                        ),
                        headerShown: false,
                        //tabBarLabel: '',

                    }}
                />
            </Tabs.Navigator>
        </AuthProvider>
    );
}

export default TabNavigator;