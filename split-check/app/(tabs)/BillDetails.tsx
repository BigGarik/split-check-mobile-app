// src/app/HomeScreen/BillDetails.tsx
import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  BillDetails: { data: { position: number; name: string; quantity: number; price: number; sum: number }[]; total: number };
};

type BillDetailsRouteProp = RouteProp<RootStackParamList, 'BillDetails'>;

type Props = {
  route: BillDetailsRouteProp;
};

type Item = {
  position: number;
  name: string;
  quantity: number;
  price: number;
  sum: number;
};

const BillDetails: React.FC<Props> = ({ route }) => {
  const { data, total } = route.params;

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.row}>
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.text}>{item.quantity}</Text>
      <Text style={styles.text}>{item.price}</Text>
      <Text style={styles.text}>{item.sum}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bills Screen</Text>
      <Text style={styles.totalPrice}>Total Price: ${total}</Text>
      <View style={styles.tableContainer}>
        <View style={styles.head}>
          <Text style={styles.text}>Item Name</Text>
          <Text style={styles.text}>Quantity</Text>
          <Text style={styles.text}>Price</Text>
          <Text style={styles.text}>Total</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.position.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f1f8ff',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF1C1',
    padding: 10,
    marginVertical: 2,
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
});

export default BillDetails;
