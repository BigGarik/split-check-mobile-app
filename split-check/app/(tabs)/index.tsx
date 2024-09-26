import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "@/app/(tabs)/_layout";
import {handleSendImage} from "@/app/HomeScreen/handleSendImage";

type IndexNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

type Props = {
    navigation: IndexNavigationProp;
};

export default function Index({ navigation }: Props) {
    const handleTestSendImage = () => {
        const dummyImage = { uri: 'dummy_image_uri' };
        const setIsLoading = (loading: boolean) => console.log('Loading:', loading);


        handleSendImage(dummyImage, setIsLoading, navigation as any);
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.scanCheckText}>Отсканируйте чек</Text>
            </View>
            <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => navigation.navigate('CameraScreen')}
            >
                <Ionicons name="camera-outline" size={100} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.testButton}
                onPress={handleTestSendImage}
            >
                <Text style={styles.testButtonText}>Test Send Image</Text>
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
    },
    testButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    testButtonText: {
        color: 'white',
        fontSize: 16,
    }
});