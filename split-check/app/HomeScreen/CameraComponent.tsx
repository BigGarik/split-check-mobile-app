import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';  // Use CameraView instead of Camera

interface CameraComponentProps {
  onClose: () => void;
  onCapture: (photo: any) => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({ onClose, onCapture }) => {
  const [facing, setFacing] = useState<'front' | 'back'>('back');  // CameraType as string literals
  const [permission, requestPermission] = useCameraPermissions();  // Camera permissions hook
  const [torchEnabled, setTorchEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();  // Request permission on mount
      }
    })();
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleTorch = () => {
    setTorchEnabled((prevTorchEnabled) => !prevTorchEnabled);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    // Implementation to take picture here with external method (depending on the library capabilities)
    // You will need to manage this with any further API as CameraView does not have takePictureAsync directly
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}  // Manage front or back camera
        enableTorch={torchEnabled}  // Toggle torch/flash
      >
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
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
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
