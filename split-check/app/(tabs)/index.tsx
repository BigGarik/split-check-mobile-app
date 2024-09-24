import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Alert, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
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
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');

  useEffect(() => {
    requestPermission();
  }, []);

  const handleCapture = async (camera: CameraView) => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setCapturedImage(photo!.uri);
      setIsCameraOpen(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <CustomButton onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" hidden={false} />
      {isCameraOpen ? (
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleCapture}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsCameraOpen(false)}>
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
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
                source={{ uri: capturedImage }}
                style={styles.preview}
                resizeMode="contain"
              />
              {isLoading ? (
                <ActivityIndicator size="large" color="#28a745" />
              ) : (
                <CustomButton
                  title="Send Image"
                  onPress={() => handleSendImage({ uri: capturedImage }, setIsLoading, navigation)}
                  style={styles.sendButton}
                  disabled={isLoading}
                />
              )}
            </View>
          )}
        </View>
      )}
      <CustomButton
        title="Send Image"
        onPress={() => capturedImage && handleSendImage({ uri: capturedImage }, setIsLoading, navigation)}
        style={styles.sendButton}
        disabled={isLoading || !capturedImage}
      />

      <CustomButton
        title="Send Image"
        onPress={() => handleSendImage({ uri : capturedImage }, setIsLoading, navigation)}
        style={styles.sendButton}
        disabled={isLoading}
      />

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
    color: 'white',
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
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
});