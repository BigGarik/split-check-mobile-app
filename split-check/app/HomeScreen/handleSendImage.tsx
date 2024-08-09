// import { Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import { StackNavigationProp } from '@react-navigation/stack';
//
// type RootStackParamList = {
//   BillDetails: { data: { position: number; name: string; quantity: number; price: number; sum: number }[]; total: number };
// };
//
// type IndexNavigationProp = StackNavigationProp<RootStackParamList, 'BillDetails'>;
//
// export const handleSendImage = async (
//   capturedImage: { uri: string } | null,
//   setIsLoading: (loading: boolean) => void,
//   navigation: IndexNavigationProp
// ) => {
//   if (!capturedImage) {
//     Alert.alert('Error', 'No image captured.');
//     return;
//   }
//
//   setIsLoading(true);
//
//   try {
//     const fileUri = capturedImage.uri;
//     const fileInfo = await FileSystem.getInfoAsync(fileUri);
//     console.log('File info:', JSON.stringify(fileInfo, null, 2));
//
//     if (!fileInfo.exists) {
//       throw new Error('File does not exist.');
//     }
//
//     const data = new FormData();
//     data.append('file', {
//       uri: fileUri,
//       name: 'photo.jpg',
//       type: 'image/jpeg',
//     } as any);
//
//     console.log('FormData prepared');
//
//     const response = await fetch('https://3896-212-3-131-87.ngrok-free.app/upload-image/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       body: data,
//     });
//
//     console.log('Response status:', response.status);
//
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//
//     let responseData;
//     const responseText = await response.json();
//     console.log('Raw response:', responseText);
//
//     try {
//       responseData = JSON.parse(responseText);
//     } catch (parseError) {
//       console.error('Error parsing JSON:', parseError);
//       throw new Error('Failed to parse server response');
//     }
//
//     console.log('Parsed response:', JSON.stringify(responseData, null, 2));
//
//     if (!responseData.response || !Array.isArray(responseData.response.items) || typeof responseData.response.total !== 'number') {
//       throw new Error('Unexpected response format');
//     }
//
//     const { items, total } = responseData.response;
//     console.log('Navigating to BillDetails with data:', { data: items, total });
//     navigation.navigate('BillDetails', { data: items, total });
//
//   } catch (error) {
//     console.error('Error in handleSendImage:', error);
//     Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
//   } finally {
//     setIsLoading(false);
//   }
// };





// src/app/HomeScreen/handleSendImage.ts
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  BillDetails: { data: { position: number; name: string; quantity: number; price: number; sum: number }[]; total: number };
};

type IndexNavigationProp = StackNavigationProp<RootStackParamList, 'BillDetails'>;

export const handleSendImage = (
  capturedImage: { uri: string } | null,
  setIsLoading: (loading: boolean) => void,
  navigation: IndexNavigationProp
) => {
  setIsLoading(true);

  // Dummy data to simulate API response
  const dummyResponse = {
    message: "Successfully uploaded photo.jpg",
    uuid: "1d3e4b75-1009-49cd-a079-a98521808b07",
    response: {
      items: [
        { position: 1, name: "apple", quantity: 2, price: 4000, sum: 8000 },
        { position: 2, name: "steak", quantity: 1, price: 16000, sum: 16000 },
        { position: 3, name: "chicken", quantity: 2, price: 2000, sum: 4000 },
        { position: 4, name: "fries", quantity: 1, price: 8000, sum: 8000 },
        { position: 5, name: "smth", quantity: 0.5, price: 7000, sum: 3500 },
        { position: 6, name: "HELP HELP HELP", quantity: 4, price: 5000, sum: 20000 },
        { position: 7, name: "Banana", quantity: 6, price: 2000, sum: 12000 },
      ],
      total: 33500
    }
  };

  // Simulating network delay
  setTimeout(() => {
    setIsLoading(false);
    const { items, total } = dummyResponse.response;
    console.log('Navigating to BillDetails with data:', { data: items, total });
    navigation.navigate('BillDetails', { data: items, total });
  }, 1000);
};
