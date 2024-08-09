// src/app/HomeScreen/Index.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Alert, ActivityIndicator, StatusBar } from 'react-native';
import * as ExpoCamera from 'expo-camera';
import { CameraComponent } from '@/app/HomeScreen/CameraComponent';
import CustomButton from '@/app/HomeScreen/CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { handleSendImage } from '@/app/HomeScreen/handleSendImage';

type RootStackParamList = {
  Index: undefined;
  BillDetails: { data: { position: number; name: string; quantity: number; price: number; sum: number }[]; total: number };
};

type IndexNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;
type IndexRouteProp = RouteProp<RootStackParamList, 'Index'>;

type Props = {
  navigation: IndexNavigationProp;
  route: IndexRouteProp;
};

export default function Index({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState<ExpoCamera.PermissionStatus | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<ExpoCamera.CameraPhoto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const mockData = Array.from({ length: 20 }, (_, index) => ({
  //   select: 'Select',
  //   itemName: `Item ${index + 1}`,
  //   quantity: (index + 1).toString(),
  //   price: `$${(index + 1) * 10}.00`,
  // }));

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

  // const handleMockSendImage = () => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     navigation.navigate('BillDetails', { data: mockData, total: 0 });
  //   }, 2000);
  // };

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
                resizeMode
                    ="contain"
              />
              {isLoading ? (
                <ActivityIndicator size="large" color="#28a745" />
              ) : (
                <CustomButton
                  title="Send Image"
                  onPress={() => handleSendImage(capturedImage, setIsLoading, navigation)}
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
