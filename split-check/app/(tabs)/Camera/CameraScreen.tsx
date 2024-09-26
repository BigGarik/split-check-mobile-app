import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Alert, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import {useCameraPermissions} from 'expo-camera';
import {StackNavigationProp} from '@react-navigation/stack';
import {handleSendImage} from '@/app/HomeScreen/handleSendImage';
import CameraComponent from "@/app/(tabs)/Camera/CameraComponent";
//import {useAuth} from "@/app/(tabs)/BillDetails/Utilities/AuthContext";
import {RootStackParamList} from "@/app/(tabs)/_layout";
//import {Ionicons} from '@expo/vector-icons';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CameraScreen'>;

type Props = {
    navigation: CameraScreenNavigationProp;
};

export default function CameraScreen({navigation}: Props) {
    //const {token} = useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraOpen, setIsCameraOpen] = useState(true);  // Set to true initially
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const setupCamera = async () => {
            const cameraPermission = await requestPermission();
            if (!cameraPermission.granted) {
                Alert.alert("Permission required", "Camera permission is required to use this feature.");
                navigation.goBack();
            }
        };

        setupCamera();
    }, []);

    const handleCapture = (imageUri: string) => {
        setCapturedImage(imageUri);
        setIsCameraOpen(false);
    };

    const sendImage = async () => {
        if (capturedImage && !isLoading) {
            try {
                setIsLoading(true);
                handleSendImage({uri: capturedImage}, setIsLoading, navigation as any);
            } catch (error) {
                console.error('Error sending image:', error);
                Alert.alert('Error', 'Failed to send image');
            } finally {
                setIsLoading(false);
            }
        } else if (!capturedImage) {
            setIsCameraOpen(true);
        }
    };

    // const retakePhoto = () => {
    //     setCapturedImage(null);
    //     setIsCameraOpen(true);
    // };

    if (!permission?.granted) {
        return null;
    }

    return (
        <View style={styles.container}>
            {isCameraOpen ? (
                <CameraComponent
                    onCapture={handleCapture}
                    //onClose={() => navigation.goBack()}
                />
            ) : (
                <>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{uri: capturedImage!}}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        {isLoading && (
                            <ActivityIndicator size="large" color="#28a745" style={styles.loadingIndicator}/>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity
                            style={[styles.button, styles.scanButton]}
                            onPress={sendImage}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? "Scanning..." : "Scan"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        height: '85%',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        height: '15%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    button: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
        borderRadius: 10
    },
    retakeButton: {
        backgroundColor: '#f44336',
    },
    scanButton: {
        backgroundColor: '#30d158',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    loadingIndicator: {
        position: 'absolute',
    },
});