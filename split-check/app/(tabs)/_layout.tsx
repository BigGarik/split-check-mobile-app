import React, {useCallback, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Index from './index';
import CameraScreen from "@/app/(tabs)/Camera/CameraScreen";
import BillDetails from "@/app/(tabs)/BillDetails/BillDetails";
import ProfileScreen from "@/app/(tabs)/Profile/ProfileScreen";
import UserHistory from './Profile/UserHistory';
import {AuthProvider} from "@/app/(tabs)/BillDetails/Utilities/AuthContext";
import * as Sharing from 'expo-sharing';
import {useFocusEffect} from "expo-router";
import GroupBillDetails from "@/app/(tabs)/BillDetails/GroupBillDetails";
//import {TouchableOpacity} from "react-native";

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
    GroupBillDetails: {
        selectedItems: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
        yourSum: number;
        totalBill: number;
        totalWithService: number;
    };
};

// type TabParamList = {
//     Home: undefined;
//     Camera: undefined;
//     Share: undefined;
//     Profile: undefined;
// };

const Stack = createStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BillDetails" component={BillDetails} options={{ headerShown: false }} />
            <Stack.Screen name="UserHistory" component={UserHistory} options={{ headerShown: false }} />
            <Stack.Screen name="GroupBillDetails" component={GroupBillDetails} options={{ headerShown: false }} />
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
        return navigation.addListener('state', () => {
            console.log('Navigation state changed');
            checkIfBillDetailsIsVisible();
        });
    }, [navigation, checkIfBillDetailsIsVisible]);

    useFocusEffect(
        useCallback(() => {
            console.log('Screen focused');
            checkIfBillDetailsIsVisible();
        }, [checkIfBillDetailsIsVisible])
    );



    const handleShare = async () => {
        try {
            await Sharing.shareAsync('https://split_check/group_url');
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
                        tabBarIcon: ({ focused, color  }) => (
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
                        tabBarIcon: ({ color }) => (
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

                {/*<Tabs.Screen*/}
                {/*    name="Back"*/}
                {/*    component={HomeStack}*/}
                {/*    options={({ navigation }) => ({*/}
                {/*        tabBarIcon: ({ color }) => (*/}
                {/*            <Ionicons*/}
                {/*                name="arrow-back"*/}
                {/*                size={30}*/}
                {/*                color={navigation.canGoBack() ? color : '#bdc3c7'}*/}
                {/*            />*/}
                {/*        ),*/}
                {/*        headerShown: false,*/}
                {/*        tabBarButton: (props) => (*/}
                {/*            <TouchableOpacity*/}
                {/*                {...props}*/}
                {/*                onPress={() => {*/}
                {/*                    if (navigation.canGoBack()) {*/}
                {/*                        navigation.goBack();*/}
                {/*                    }*/}
                {/*                }}*/}
                {/*                style={[*/}
                {/*                    props.style,*/}
                {/*                    { opacity: navigation.canGoBack() ? 1 : 0.5 }*/}
                {/*                ]}*/}
                {/*            />*/}
                {/*        ),*/}
                {/*    })}*/}
                {/*/>*/}
                {isBillDetailsVisible ? (
                    <Tabs.Screen
                        name="Share"
                        component={HomeStack}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Ionicons name="share-social-outline" size={30} color={color} />
                            ),
                            headerShown: false,
                            //tabBarLabel: '',
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
                            tabBarIcon: ({ focused, color }) => (
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
                        tabBarIcon: ({ focused, color }) => (
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