import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraView } from 'expo-camera';
import DocumentScanner, { ScanDocumentResponse, ResponseType } from 'react-native-document-scanner-plugin';

interface CameraComponentProps {
  onClose: () => void;
  onCapture: (photo: string) => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({ onClose, onCapture }) => {
  const cameraRef = useRef<CameraView>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo && photo.uri) {
        await processImage(photo.uri);
      }
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      const scannedDoc: ScanDocumentResponse = await DocumentScanner.scanDocument({
        croppedImageQuality: 100,
        maxNumDocuments: 1,
        responseType: ResponseType.ImageFilePath
      });


      if (scannedDoc.scannedImages && scannedDoc.scannedImages.length > 0) {
        setScannedImage(scannedDoc.scannedImages[0]);
        onCapture(scannedDoc.scannedImages[0]);
      }
    } catch (error) {
      console.error('Failed to scan document:', error);
    }
  };

  const toggleTorch = () => {
    setTorchEnabled((prevTorchEnabled) => !prevTorchEnabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      {scannedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: scannedImage }} style={styles.previewImage} />
          <TouchableOpacity style={styles.button} onPress={() => setScannedImage(null)}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          enableTorch={torchEnabled}
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
          </View>
        </CameraView>
      )}
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
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
});