import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';

export default function Profile() {
  const [tableHead, setTableHead] = useState(['Select', 'Item Name', 'Quantity', 'Price/Total']);
  const [tableData, setTableData] = useState([
    ['Select', 'Item 1', '1', '$10.00'],
    ['Select', 'Item 2', '2', '$20.00'],
    ['Select', 'Item 3', '3', '$30.00'],
  ]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bills Screen</Text>
      <View style={styles.tableContainer}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} style={styles.row} textStyle={styles.text} />
        </Table>
      </View>
    </ScrollView>
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
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  row: {
    height: 30,
    backgroundColor: '#FFF1C1',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
});
