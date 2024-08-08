// // src/app/HomeScreen/handleSendImage.ts
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
//   if (capturedImage) {
//     setIsLoading(true);
//     try {
//       const fileUri = capturedImage.uri;
//       const fileInfo = await FileSystem.getInfoAsync(fileUri);
//       console.log('File info:', fileInfo);
//
//       if (!fileInfo.exists) {
//         Alert.alert('Error', 'File does not exist.');
//         setIsLoading(false);
//         return;
//       }
//
//       const data = new FormData();
//       data.append('file', {
//         uri: fileUri,
//         name: `photo.jpg`,
//         type: 'image/jpeg',
//       } as any);
//
//       console.log('FormData prepared:', data);
//
//       const response = await fetch('https://3896-212-3-131-87.ngrok-free.app/upload-image/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: data,
//       });
//
//       const responseData = await response.json();
//       console.log('Upload response:', responseData);
//
//       if (response.ok && responseData.response && Array.isArray(responseData.response.items)) {
//         const { items, total } = responseData.response;
//         console.log('Navigating to BillDetails with data:', { data: items, total });
//         navigation.navigate('BillDetails', { data: items, total });
//       } else {
//         Alert.alert('Error', 'Unexpected response format.');
//         console.error('Unexpected response format:', responseData);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while uploading the image.');
//       console.error('Upload error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   } else {
//     Alert.alert('Error', 'No image captured.');
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
        { position: 1, name: "Бабушкин хлеб", quantity: 2, price: 4000, sum: 8000 },
        { position: 2, name: "Сочники", quantity: 1, price: 16000, sum: 16000 },
        { position: 3, name: "Кетчуп 15гр", quantity: 2, price: 2000, sum: 4000 },
        { position: 4, name: "Картофель фри", quantity: 1, price: 8000, sum: 8000 },
        { position: 5, name: "Рис отварной", quantity: 0.5, price: 7000, sum: 3500 }
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



