import React, {useRef, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import {Camera} from 'expo-camera';
import {CameraView} from 'expo-camera';

interface CameraComponentProps {
    onClose: () => void;
    onCapture: (photo: any) => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({onClose, onCapture}) => {
    const cameraRef = useRef<CameraView>(null);
    const [torchEnabled, setTorchEnabled] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View/>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            onCapture(photo);
        }
    };

    const toggleTorch = () => {
        setTorchEnabled((prevTorchEnabled) => !prevTorchEnabled);
    };

    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                style={styles.camera}
                ref={cameraRef}
                enableTorch={torchEnabled}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.buttonText}>Capture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={toggleTorch}>
                        <Text style={styles.buttonText}>
                            {torchEnabled ? 'Disable Torch' : 'Enable Torch'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: 'black',
    },
});
