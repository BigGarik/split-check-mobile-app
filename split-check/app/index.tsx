import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image } from 'react-native';
import * as ExpoCamera from 'expo-camera';
import { CameraComponent } from './CameraComponent';

export default function Index() {
  const [hasPermission, setHasPermission] = useState<ExpoCamera.PermissionStatus | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<ExpoCamera.CameraPhoto | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.Camera.requestCameraPermissionsAsync();
      setHasPermission(status);
    })();
  }, []);

  const handleCapture = (photo: ExpoCamera.CameraPhoto) => {
    setCapturedImage(photo);
    setIsCameraOpen(false);
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission !== ExpoCamera.PermissionStatus.GRANTED) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>need permission to access camera</Text>
        <Button
          onPress={() => ExpoCamera.Camera.requestCameraPermissionsAsync()}
          title="Grant permission"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <CameraComponent
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCapture}
        />
      ) : (
        <View style={styles.content}>
          <Text style={styles.text}>Camera is currently closed.</Text>
          <Button
            title="Open Camera"
            onPress={() => setIsCameraOpen(true)}
          />
          {capturedImage && (
            <View style={styles.previewContainer}>
              <Text style={styles.text}>Last Captured Image:</Text>
              <Image
                source={{ uri: capturedImage.uri }}
                style={styles.preview}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      )}
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
    padding: 50,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
});
