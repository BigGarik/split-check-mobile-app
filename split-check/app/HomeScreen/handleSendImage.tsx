import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NavigationProp } from '@react-navigation/native';
import { useAuth } from "@/app/(tabs)/BillDetails/Utilities/AuthContext";

type RecognizedItem = {
  id?: number;
  name?: string;
  quantity?: number;
  price?: number;
};

type RecognizedJson = {
  restaurant?: string;
  table_number?: string;
  order_number?: string;
  date?: string;
  time?: string;
  waiter?: string;
  items?: RecognizedItem[];
  subtotal?: number;
  service_charge?: {
    name: string;
    amount: number;
  };
  vat?: {
    rate: number;
    amount: number;
  };
  total?: number;
};

type RootStackParamList = {
  BillDetails: {
    data: { position: number; name: string; quantity: number; price: number; sum: number }[];
    total: number;
    restaurantInfo: {
      name: string;
      tableNumber: string;
      orderNumber: string;
      date: string;
      time: string;
      waiter: string;
    };
    serviceCharge: {
      name: string;
      amount: number;
    };
    vat: {
      rate: number;
      amount: number;
    };
  };
};

export const handleSendImage = async (
  capturedImage: { uri: string } | null,
  setIsLoading: (loading: boolean) => void,
  navigation: NavigationProp<RootStackParamList, 'BillDetails'>
) => {
  const { token } = useAuth();

  if (!capturedImage) {
    Alert.alert('Error', 'No image captured.');
    return;
  }

  if (!token) {
    Alert.alert('Error', 'You are not logged in. Please log in to send images.');
    return;
  }

  setIsLoading(true);

  try {
    const fileInfo = await FileSystem.getInfoAsync(capturedImage.uri);
    if (!fileInfo.exists) {
      throw new Error('Image file does not exist.');
    }

    const formData = new FormData();
    formData.append('file', {
      uri: capturedImage.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await fetch('https://biggarik.ru/split_check/upload-image/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Your session may have expired. Please log in again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Step 4: Parse the response
    const responseData = await response.json();
    console.log('Server response:', JSON.stringify(responseData, null, 2));

    if (!responseData.recognized_json) {
      throw new Error('Unexpected response format: missing recognized_json');
    }

    const recognizedJson: RecognizedJson = responseData.recognized_json;

    if (!Array.isArray(recognizedJson.items)) {
      throw new Error('Unexpected response format: items is not an array');
    }

    const formattedData = recognizedJson.items.map((item, index) => ({
      position: item.id ?? index + 1,
      name: item.name ?? 'Unknown Item',
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
      sum: (item.quantity ?? 0) * (item.price ?? 0)
    }));

    const billDetails = {
      data: formattedData,
      total: recognizedJson.total ?? 0,
      restaurantInfo: {
        name: recognizedJson.restaurant ?? 'Unknown Restaurant',
        tableNumber: recognizedJson.table_number ?? 'N/A',
        orderNumber: recognizedJson.order_number ?? 'N/A',
        date: recognizedJson.date ?? 'N/A',
        time: recognizedJson.time ?? 'N/A',
        waiter: recognizedJson.waiter ?? 'N/A'
      },
      serviceCharge: recognizedJson.service_charge ?? { name: 'Service Charge', amount: 0 },
      vat: recognizedJson.vat ?? { rate: 0, amount: 0 }
    };

    console.log('Formatted bill details:', JSON.stringify(billDetails, null, 2));

    navigation.navigate('BillDetails', billDetails);

  } catch (error) {
    console.error('Error in handleSendImage:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      errorMessage = error.message;
    }
    Alert.alert('Error', errorMessage);
  } finally {
    setIsLoading(false);
  }
};



//
// import {StackNavigationProp} from '@react-navigation/stack';
//
// type RootStackParamList = {
//     BillDetails: {
//         data: { position: number; name: string; quantity: number; price: number; sum: number }[];
//         total: number;
//         restaurantInfo: {
//             name: string;
//             tableNumber: string;
//             orderNumber: string;
//             date: string;
//             time: string;
//             waiter: string;
//         };
//         serviceCharge: {
//             name: string;
//             amount: number;
//         };
//         vat: {
//             rate: number;
//             amount: number;
//         };
//     };
// };
//
// type IndexNavigationProp = StackNavigationProp<RootStackParamList, 'BillDetails'>;
//
// export const handleSendImage = (
//     capturedImage: { uri: string } | null,
//     setIsLoading: (loading: boolean) => void,
//     navigation: IndexNavigationProp
// ) => {
//     setIsLoading(true);
//
//     const mockResponse = {
//         "message": "Successfully uploaded image.jpg",
//         "uuid": "9d0dd3fc-86e1-401a-bf0e-9f2d511b2442",
//         "recognized_json": {
//             "restaurant": "Веранда",
//             "table_number": "110",
//             "order_number": "57",
//             "date": "17.08.2024",
//             "time": "17:28",
//             "waiter": "Нурсултан А.",
//             "items": [
//                 {
//                     "id": 1,
//                     "name": "Мохито 300 мл б/а",
//                     "quantity": 1,
//                     "price": 65000
//                 },
//                 {
//                     "id": 2,
//                     "name": "Вода Chortog 750мл без газа холодный",
//                     "quantity": 1,
//                     "price": 38000
//                 },
//                 {
//                     "id": 3,
//                     "name": "Paulaner",
//                     "quantity": 2,
//                     "price": 330000
//                 },
//                 {
//                     "id": 4,
//                     "name": "пиво Eggenberg Freibie г 330 мл",
//                     "quantity": 2,
//                     "price": 190000
//                 },
//                 {
//                     "id": 5,
//                     "name": "Ризотто с трюфелем",
//                     "quantity": 1,
//                     "price": 186000
//                 },
//                 {
//                     "id": 6,
//                     "name": "Наггетсы из индейки 5 шт",
//                     "quantity": 2,
//                     "price": 144000
//                 },
//                 {
//                     "id": 7,
//                     "name": "Картофель фри",
//                     "quantity": 1,
//                     "price": 45000
//                 },
//                 {
//                     "id": 8,
//                     "name": "Суши лосось",
//                     "quantity": 6,
//                     "price": 270000
//                 },
//                 {
//                     "id": 9,
//                     "name": "Кейк-попс с декором",
//                     "quantity": 2,
//                     "price": 70000
//                 },
//                 {
//                     "id": 10,
//                     "name": "Пицца с грушей с горго нзолой",
//                     "quantity": 1,
//                     "price": 155000
//                 },
//                 {
//                     "id": 11,
//                     "name": "Чай Ассам",
//                     "quantity": 1,
//                     "price": 45000
//                 },
//                 {
//                     "id": 12,
//                     "name": "Лимон добавка",
//                     "quantity": 1,
//                     "price": 12000
//                 },
//                 {
//                     "id": 13,
//                     "name": "Куриная котлета с гарн иром картофельное пюре",
//                     "quantity": 1,
//                     "price": 84000
//                 },
//                 {
//                     "id": 14,
//                     "name": "Макаронс малина",
//                     "quantity": 2,
//                     "price": 50000
//                 },
//                 {
//                     "id": 15,
//                     "name": "Макаронс шоколад",
//                     "quantity": 3,
//                     "price": 75000
//                 },
//                 {
//                     "id": 16,
//                     "name": "Вода Chortog 750мл без газа холодный",
//                     "quantity": 1,
//                     "price": 38000
//                 },
//                 {
//                     "id": 17,
//                     "name": "кетчуп добавка",
//                     "quantity": 1,
//                     "price": 20000
//                 }
//             ],
//             "subtotal": 1817000,
//             "service_charge": {
//                 "name": "Сервисный сбор 12%",
//                 "amount": 218040
//             },
//             "vat": {
//                 "rate": 0,
//                 "amount": 0
//             },
//             "total": 2035040
//         }
//     };
//
//     // Simulating network delay
//     setTimeout(() => {
//         setIsLoading(false);
//         try {
//             const {
//                 items,
//                 total,
//                 restaurant,
//                 table_number,
//                 order_number,
//                 date,
//                 time,
//                 waiter,
//                 service_charge,
//                 vat
//             } = mockResponse.recognized_json;
//
//             console.log('Extracted values:', {
//                 items, total, restaurant, table_number, order_number,
//                 date, time, waiter, service_charge, vat
//             });
//
//             const undefinedValues = Object.entries({
//                 items, total, restaurant, table_number, order_number,
//                 date, time, waiter, service_charge, vat
//             }).filter(([key, value]) => value === undefined);
//
//             if (undefinedValues.length > 0) {
//                 console.warn('Warning: Some values are undefined:', undefinedValues);
//             }
//
//             const formattedData = items.map((item, index) => ({
//                 position: item.id,
//                 name: item.name,
//                 quantity: item.quantity,
//                 price: item.price,
//                 sum: item.quantity * item.price
//             }));
//
//             const billDetails = {
//                 data: formattedData,
//                 total: total,
//                 restaurantInfo: {
//                     name: restaurant || '',
//                     tableNumber: table_number || '',
//                     orderNumber: order_number || '',
//                     date: date || '',
//                     time: time || '',
//                     waiter: waiter || ''
//                 },
//                 serviceCharge: service_charge || {name: '', amount: 0},
//                 vat: vat || {rate: 0, amount: 0}
//             };
//
//             console.log('Navigating to BillDetails with data:', JSON.stringify(billDetails, null, 2));
//             navigation.navigate('BillDetails', billDetails);
//         } catch (error) {
//             console.error('Error in handleSendImage:', error);
//         }
//     }, 1000);
// };