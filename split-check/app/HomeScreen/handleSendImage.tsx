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
//     const response = await fetch('https://biggarik.ru/split_check/upload-image/', {
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


import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
    BillDetails: {
        data: { position: number; name: string; quantity: number; price: number; sum: number }[];
        total: number
    };
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
                {
                    position: 1,
                    name: "Чай с лимоном,медом, ягодными листьями , ягодными листьями",
                    quantity: 1,
                    price: 2900,
                    sum: 2900
                },
                {position: 2, name: "Моктейль Сено 200 мл", quantity: 1, price: 2500.00, sum: 2500.00},
                {position: 3, name: "Печеный батат", quantity: 2, price: 3200.00, sum: 6400},
                {position: 4, name: "Салат с пшеницей", quantity: 1, price: 5100.00, sum: 5100.00},
                {position: 5, name: "Бешбармак", quantity: 1, price: 2900, sum: 2900},
                {position: 6, name: "Лапша на воке с говядиной", quantity: 2, price: 4800, sum: 9600.00},
                {position: 7, name: "Лепешка из тандыра, кунжут", quantity: 1, price: 900, sum: 900},
                {position: 8, name: "Комплимент бауырсаки", quantity: 1, price: 0, sum: 0},
                {position: 9, name: "Моктейль Грецкий орех 200 мл", quantity: 1, price: 2600, sum: 2600},
                {position: 10, name: "Айран комплимент", quantity: 3, price: 0, sum: 0},
                {position: 11, name: "Медовик", quantity: 1, price: 3800, sum: 3800},
            ],
            total: 33000,
            vat: 12
        }
    };

    // Simulating network delay
    setTimeout(() => {
        setIsLoading(false);
        const {items, total} = dummyResponse.response;
        console.log('Navigating to BillDetails with data:', {data: items, total});
        navigation.navigate('BillDetails', {data: items, total});
    }, 1000);
};
