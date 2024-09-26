import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, CameraType, FocusMode  } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

interface CameraComponentProps {
    onCapture: (imageUri: string) => void;
    //onClose: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture /*, onClose*/ }) => {
    const [facing/*, setFacing*/] = useState<CameraType>('back');
    const [isTorchOn, setIsTorchOn] = useState(false);
    const cameraRef = useRef<CameraView | null>(null);

    const handleCapture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    const fileName = `${FileSystem.documentDirectory}captured_image.jpg`;
                    await FileSystem.moveAsync({
                        from: photo.uri,
                        to: fileName
                    });
                    onCapture(fileName);
                } else {
                    throw new Error('Failed to capture image');
                }
            } catch (error) {
                console.error('Error capturing image:', error);
            }
        }
    };

    // const toggleCameraFacing = () => {
    //     setFacing(current => (current === 'back' ? 'front' : 'back'));
    // };

    const toggleTorch = () => {
        setIsTorchOn(current => !current);
    };




    return (
        <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            enableTorch={isTorchOn}
        >
            <TouchableOpacity style={styles.iconButton} onPress={toggleTorch}>
                    <Ionicons name={isTorchOn ? 'flash' : 'flash-off'} size={24} color="white" />
                </TouchableOpacity>
            <View style={styles.buttonContainer}>
                {/*<TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>*/}
                {/*    <Ionicons name="camera-reverse" size={24} color="white" />*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                    <View style={styles.innerCircle} />
                </TouchableOpacity>
            </View>
        </CameraView>
    );
};

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginBottom: '10%'
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf : 'flex-end',


        margin : 15
    },
});

export default CameraComponent;