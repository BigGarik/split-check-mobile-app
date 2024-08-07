// src/app/HomeScreen/handleSendImage.ts
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const handleSendImage = async (
  capturedImage: { uri: string } | null,
  setIsLoading: (loading: boolean) => void
) => {
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
