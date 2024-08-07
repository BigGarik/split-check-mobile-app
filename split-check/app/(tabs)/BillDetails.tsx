import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  BillDetails: { data: { select: string; itemName: string; quantity: string; price: string }[] };
};

type BillDetailsRouteProp = RouteProp<RootStackParamList, 'BillDetails'>;

type Props = {
  route: BillDetailsRouteProp;
};

type Item = {
  select: string;
  itemName: string;
  quantity: string;
  price: string;
};

export default function BillDetails({ route }: Props) {
  const { data } = route.params;
  const [tableHead] = useState(['Select', 'Item Name', 'Quantity', 'Price/Total']);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleSelectItem = (item: Item) => {
    const isSelected = selectedItems[item.itemName] !== undefined;

    if (isSelected) {
      // Unselect the item if it is already selected
      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[item.itemName];
      setSelectedItems(newSelectedItems);
    } else if (parseInt(item.quantity) === 1) {
      // Auto-select if there's only one quantity available
      setSelectedItems(prevState => ({
        ...prevState,
        [item.itemName]: 1
      }));
    } else {
      // Open modal for selecting quantity
      setCurrentItem(item);
      setSelectedQuantity(1); // Reset to 1 each time a new item is selected
      setModalVisible(true);
    }
  };

  const handleConfirmSelection = () => {
    if (currentItem) {
      setSelectedItems(prevState => ({
        ...prevState,
        [currentItem.itemName]: selectedQuantity
      }));
    }
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Item }) => {
    const selectedQty = selectedItems[item.itemName] || 0;
    const isSelected = selectedQty > 0;
    return (
      <TouchableOpacity onPress={() => handleSelectItem(item)}>
        <View style={[styles.row, isSelected && styles.selectedRow]}>
          <Text style={styles.text}>{isSelected ? 'Selected' : 'Select'}</Text>
          <Text style={styles.text}>{item.itemName}</Text>
          <Text style={styles.text}>{selectedQty}/{item.quantity}</Text>
          <Text style={styles.text}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const calculateTotalPrice = () => {
    return Object.keys(selectedItems).reduce((total, itemName) => {
      const item = data.find(item => item.itemName === itemName);
      if (item) {
        const quantity = selectedItems[itemName];
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g,"")); // Ensure price is a float
        return total + (price * quantity);
      }
      return total;
    }, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bills Screen</Text>
      <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice()}</Text>
      <View style={styles.tableContainer}>
        <View style={styles.head}>
          {tableHead.map((header, index) => (
            <Text key={index} style={styles.text}>{header}</Text>
          ))}
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {currentItem && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Select Quantity for {currentItem.itemName}</Text>
              <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.quantityContainer}>
                {Array.from({ length: parseInt(currentItem.quantity) }, (_, i) => i + 1).map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[styles.quantityButton, selectedQuantity === num && styles.selectedQuantityButton]}
                    onPress={() => setSelectedQuantity(num)}
                  >
                    <Text>{num}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button title="Confirm" onPress={handleConfirmSelection} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

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
  selectedRow: {
    backgroundColor: '#90EE90', // Light green background for selected rows
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    height: '50%', // Fixed height for the modal
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  scrollContainer: {
    width: '100%',
  },
  quantityContainer: {
    alignItems: 'center',
  },
  quantityButton: {
    margin: 5,
    padding: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectedQuantityButton: {
    backgroundColor: '#BBB',
  },
});
