import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { StackNavigationProp } from '@react-navigation/stack';
import { handleSendImage } from '@/app/HomeScreen/handleSendImage';
import CameraComponent from "@/app/HomeScreen/CameraComponent";
import { useAuth } from "@/app/(tabs)/BillDetails/Utilities/AuthContext";
import { RootStackParamList } from "@/app/(tabs)/_layout";
import { Ionicons } from '@expo/vector-icons';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CameraScreen'>;

type Props = {
    navigation: CameraScreenNavigationProp;
};

export default function CameraScreen({ navigation }: Props) {
    const { token } = useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    const handleCapture = (imageUri: string) => {
        setCapturedImage(imageUri);
        setIsCameraOpen(false);
    };

    const sendImage = async () => {
        if (capturedImage && !isLoading) {
            try {
                setIsLoading(true);
                await handleSendImage({ uri: capturedImage }, setIsLoading, navigation as any);
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

    const retakePhoto = () => {
        setCapturedImage(null);
        setIsCameraOpen(true);
    };

    if (!permission) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            {isCameraOpen ? (
                <CameraComponent
                    onCapture={handleCapture}
                    onClose={() => setIsCameraOpen(false)}
                />
            ) : (
                <>
                    <View style={styles.imageContainer}>
                        {capturedImage ? (
                            <Image
                                source={{ uri: capturedImage }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Ionicons name="image-outline" size={100} color="#999" />
                                <Text style={styles.placeholderText}>No image captured</Text>
                            </View>
                        )}
                        {isLoading && (
                            <ActivityIndicator size="large" color="#28a745" style={styles.loadingIndicator} />
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        {capturedImage && (
                            <TouchableOpacity
                                style={[styles.button, styles.retakeButton]}
                                onPress={retakePhoto}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>Retake</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.button, capturedImage ? styles.scanButton : styles.fullWidthButton]}
                            onPress={sendImage}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {capturedImage ? (isLoading ? "Scanning..." : "Scan") : "Take Photo"}
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
        width: '80%',
        height: '100%',
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 20,
        fontSize: 18,
        color: '#999',
    },
    buttonContainer: {
        height: '15%',
        flexDirection: 'row',
        alignItems : 'center',
        justifyContent : 'space-around'
    },
    button: {
        padding : 15,
        justifyContent: 'center',
        alignItems: 'center',
        width : '45%',
        borderRadius : 10
    },
    fullWidthButton: {
        backgroundColor: '#30d158',
        width : '80%'
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