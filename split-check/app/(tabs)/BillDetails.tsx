import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  const handleItemPress = (item: Item) => {
    if (item.quantity > 1) {
      setSelectedItem(item);
      setSelectedQuantity(0);
      setModalVisible(true);
    } else {
      toggleSelection(item.position);
    }
  };

  const toggleSelection = (position: number) => {
    if (selectedItems.includes(position)) {
      setSelectedItems(selectedItems.filter((item) => item !== position));
    } else {
      setSelectedItems([...selectedItems, position]);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://3896-212-3-131-87.ngrok-free.app/get_check/cf50855c-fb15-4150-8937-c40c7e3f5c7c', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const shareData = await response.json();
      console.log(shareData);
      return shareData;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleConfirmQuantity = () => {
    if (selectedItem) {
      if (selectedQuantity === 0) {
        setSelectedItems(selectedItems.filter((item) => item !== selectedItem.position));
      } else {
        setSelectedItems([...selectedItems.filter((item) => item !== selectedItem.position), selectedItem.position]);
      }
    }
    setModalVisible(false);
    setSelectedItem(null);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={[
        styles.row,
        { backgroundColor: selectedItems.includes(item.position) ? '#d3d3d3' : '#FFF1C1' },
      ]}
      onPress={() => handleItemPress(item)}
    >
      <Text style={[styles.text, styles.nameColumn]}>
        {item.name.length > 50 ? `${item.name.substring(0, 47)}...` : item.name}
      </Text>
      <Text style={[styles.text, styles.quantityColumn]}>{item.quantity}</Text>
      <Text style={[styles.text, styles.priceColumn]}>{item.price}</Text>
      <Text style={[styles.text, styles.sumColumn]}>{item.sum}</Text>
    </TouchableOpacity>
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
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Quantity</Text>
              <ScrollView style={styles.quantityScrollView}>
                {Array.from({ length: selectedItem.quantity + 1 }, (_, i) => (
                  <Button
                    key={i}
                    title={`${i}`}
                    onPress={() => setSelectedQuantity(i)}
                    color={selectedQuantity === i ? '#2196F3' : '#000'}
                  />
                ))}
              </ScrollView>
              <Button
                title="Confirm"
                onPress={handleConfirmQuantity}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                  setSelectedItem(null);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
      <Button
        title="Share"
        onPress={async () => {
          await fetchData();
        }}
      />
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
    backgroundColor: '#f1f8ff',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF1C1',
    padding: 10,
    marginVertical: 2,
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  nameColumn: {
    flex: 1,
    width: '35%',
    textAlign: 'left',
  },
  quantityColumn: {
    flex: 1,
    width: '15%',
    textAlign: 'center',
  },
  priceColumn: {
    flex: 1,
    width: '25%',
    textAlign: 'center',
  },
  sumColumn: {
    flex: 1,
    width: '25%',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    height : 350,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    width : 250,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  quantityScrollView: {
    maxHeight: 200,
    width: '100%',
    marginBottom: 20,
  },
});

export default BillDetails;
