import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from "@/app/(tabs)/_layout";

type IndexNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

type Props = {
    navigation: IndexNavigationProp;
};

export default function Index({navigation}: Props) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.scanCheckText}>Отсканируйте чек</Text>
            </View>
            <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => navigation.navigate('CameraScreen')}
            >
                <Ionicons name="camera-outline" size={100} color="black"/>

            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white"
    },
    cameraButton: {
        borderWidth: 2,
        borderColor: '#9ccfe0',
        borderRadius: 10,
        width: '65%',
        alignItems: 'center',
        padding: '10%'

    },
    scanCheckText: {
        padding: 15,
        fontSize: 18
    }
});