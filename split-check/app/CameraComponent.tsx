import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import * as ExpoCamera from 'expo-camera';

interface CameraComponentProps {
  onClose: () => void;
  onCapture: (photo: ExpoCamera.CameraPhoto) => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({ onClose, onCapture }) => {
  const cameraRef = useRef<ExpoCamera.CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onCapture(photo);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoCamera.CameraView
        style={styles.camera}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </ExpoCamera.CameraView>
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