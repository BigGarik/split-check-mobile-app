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
      <Text style={[styles.text, styles.nameColumn]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
      <Text style={[styles.text, styles.quantityColumn]}>{item.quantity}</Text>
      <Text style={[styles.text, styles.priceColumn]}>{item.price}</Text>
      <Text style={[styles.text, styles.sumColumn]}>{item.sum}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bills Screen</Text>
      <Text style={styles.totalPrice}>Total Price: ${total}</Text>
      <View style={styles.tableContainer}>
        <View style={styles.head}>
          <Text style={[styles.text, styles.nameColumn]}>Item Name</Text>
          <Text style={[styles.text, styles.quantityColumn]}>Quantity</Text>
          <Text style={[styles.text, styles.priceColumn]}>Price</Text>
          <Text style={[styles.text, styles.sumColumn]}>Total</Text>
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
  nameColumn: {
    flex: 2,
    width: 100,
    overflow: 'hidden',
  },
  quantityColumn: {
    flex: 1,
    width: 50,
  },
  priceColumn: {
    flex: 1,
    width: 70,
  },
  sumColumn: {
    flex: 1,
    width: 70,
  },
});

export default BillDetails;
