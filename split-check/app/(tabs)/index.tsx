import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, Alert, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
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
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

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
          setCapturedImage(fileName);
          setIsCameraOpen(false);
        } else {
          throw new Error('Failed to capture image');
        }
      } catch (error) {
        console.error('Error capturing image:', error);
        Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const sendImage = async () => {
    if (capturedImage) {
      try {
        setIsLoading(true);
        handleSendImage({ uri: capturedImage }, setIsLoading, navigation as any);
      } catch (error) {
        console.error('Error sending image:', error);
        Alert.alert('Error', 'Failed to send image');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Error', 'No image captured');
    }
  };

  if (!permission) {
    return <View />;
  }

  // if (!permission.granted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.text}>We need your permission to show the camera</Text>
  //       <CustomButton onPress={requestPermission} title="Grant permission" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" hidden={false} />
      {isCameraOpen ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCapture}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsCameraOpen(false)}>
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.content}>
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
                  onPress={sendImage}
                  style={styles.sendButton}
                  disabled={isLoading}
                />
              )}
            </View>
          )}
        </View>
      )}
      {/*for te3sting*/}
      <CustomButton
        title="Send Image"
        onPress={() => handleSendImage(null , setIsLoading, navigation as any)}
        style={styles.sendButton}
        disabled={isLoading}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
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