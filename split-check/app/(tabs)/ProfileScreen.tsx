import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import {RootStackParamList} from "@/app/(tabs)/_layout";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text>
            <Button title="View My History" onPress={() => navigation.navigate('UserHistory')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
