import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image, Alert, ActivityIndicator, StatusBar} from 'react-native';
import {useCameraPermissions} from 'expo-camera';
import CustomButton from '@/app/HomeScreen/CustomButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {handleSendImage} from '@/app/HomeScreen/handleSendImage';
import CameraComponent from "@/app/HomeScreen/CameraComponent";
import {useAuth} from "@/app/(tabs)/BillDetails/Utilities/AuthContext";
import {RootStackParamList} from "@/app/(tabs)/_layout";

type IndexNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;
type IndexRouteProp = RouteProp<RootStackParamList, 'Index'>;

type Props = {
    navigation: IndexNavigationProp;
    route: IndexRouteProp;
};

export default function Index({navigation}: Props) {
    const {token} = useAuth();
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
                await handleSendImage({uri: capturedImage}, setIsLoading, navigation as any);
            } catch (error) {
                console.error('Error sending image:', error);
                Alert.alert('Error', 'Failed to send image');
            } finally {
                setIsLoading(false);
            }
        } else if (!capturedImage) {
            Alert.alert('Error', 'No image captured');
        }
    };

    if (!permission) {
        return <View/>;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" hidden={false}/>
            {isCameraOpen ? (
                <CameraComponent
                    onCapture={handleCapture}
                    onClose={() => setIsCameraOpen(false)}
                />
            ) : (
                <View style={styles.content}>
                    <CustomButton
                        title="Open Camera"
                        onPress={() => setIsCameraOpen(true)}
                        disabled={isLoading}
                    />
                    {capturedImage && (
                        <View style={styles.previewContainer}>
                            <Image
                                source={{uri: capturedImage}}
                                style={styles.preview}
                                resizeMode="contain"
                            />
                            <CustomButton
                                title={isLoading ? "Sending..." : "Send Image"}
                                onPress={sendImage}
                                style={styles.sendButton}
                                disabled={isLoading}
                            />
                            {isLoading && (
                                <ActivityIndicator size="large" color="#28a745" style={styles.loadingIndicator}/>
                            )}
                        </View>
                    )}
                </View>
            )}
            {/* For testing */}
            <CustomButton
                title={isLoading ? "Sending..." : "Send Test Image"}
                onPress={() => handleSendImage(null, setIsLoading, navigation as any)}
                style={styles.sendButton}
                disabled={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        color: 'black',
    },
    previewContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    preview: {
        width: '80%',
        height: '80%',
    },
    sendButton: {
        marginTop: 20,
        backgroundColor: '#28a745',
    },
    loadingIndicator: {
        marginTop: 20,
    },
});