import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Alert, ActivityIndicator, StatusBar } from 'react-native';
import * as ExpoCamera from 'expo-camera';
import * as FileSystem from 'expo-file-system';
// import uuid from 'react-native-uuid';
import { CameraComponent } from '@/app/HomeScreen/CameraComponent';
import CustomButton from '@/app/HomeScreen/CustomButton';

export default function Index() {
  const [hasPermission, setHasPermission] = useState<ExpoCamera.PermissionStatus | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<ExpoCamera.CameraPhoto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await ExpoCamera.Camera.requestCameraPermissionsAsync();
        setHasPermission(status);
      } catch (error) {
        Alert.alert('Error', 'Failed to get camera permissions.');
        console.error('Camera permission error:', error);
      }
    };

    requestPermission();
  }, []);

  const handleCapture = (photo: ExpoCamera.CameraPhoto) => {
    setCapturedImage(photo);
    setIsCameraOpen(false);
  };

  const handleSendImage = async () => {
    if (capturedImage) {
      setIsLoading(true);
      try {
        const fileUri = capturedImage.uri;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log('File info:', fileInfo);

        if (!fileInfo.exists) {
          Alert.alert('Error', 'File does not exist.');
          setIsLoading(false);
          return;
        }

        const data = new FormData();
        data.append('file', {
          uri: fileUri,
          name: `photo.jpg`,
          type: 'image/jpeg',
        } as any);

        console.log('FormData prepared:', data);

        const response = await fetch('https://3896-212-3-131-87.ngrok-free.app/upload-image/', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        });

        if (response.ok) {
          const result = await response.json();
          Alert.alert('Success', 'Image uploaded successfully.');
          console.log('Upload response:', result);
        } else {
          const errorText = await response.text();
          Alert.alert('Error', `Failed to upload image: ${response.status} - ${errorText}`);
          console.error('Upload error:', response.status, errorText);
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while uploading the image.');
        console.error('Upload error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Error', 'No image captured.');
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission !== ExpoCamera.PermissionStatus.GRANTED) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <CustomButton
          title="Grant permission"
          onPress={() => ExpoCamera.Camera.requestCameraPermissionsAsync()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" hidden={false} />
      {isCameraOpen ? (
        <CameraComponent
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCapture}
        />
      ) : (
        <View style={styles.content}>
          <Text style={styles.text}>Camera is currently closed.</Text>
          <CustomButton
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
              {isLoading ? (
                <ActivityIndicator size="large" color="#28a745" />
              ) : (
                <CustomButton
                  title="Send Image"
                  onPress={handleSendImage}
                  style={styles.sendButton}
                  disabled={isLoading}
                />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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
});
