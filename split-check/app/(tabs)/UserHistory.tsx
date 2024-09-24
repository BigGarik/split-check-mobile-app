// UserHistory.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function UserHistory() {
  const historyData = [
    { date: '22.09.2024', amount: '415 600,00', positive: true },
    { date: '20.09.2024', amount: '329 000,00', positive: false, subItems: [{ title: '146 000,00', icon: '📄' }, { title: '80 000,00', icon: '📊' }] },
    { date: '20.09.2024', amount: '226 000,00', positive: false, subItems: [{ title: '146 000,00', icon: '📄' }, { title: '80 000,00', icon: '📊' }] },
    { date: '19.09.2024', amount: '415 600,00', positive: true },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Мои чеки</Text>
      {historyData.map((item, index) => (
        <View key={index} style={[
  styles.item,
  item.positive ? styles.positive : styles.negative,
  item.subItems ? styles.withSubItems : null // Apply borderBottom if subItems exist
]}>
  <View style={styles.dateAndAmountCont}>
    <Text style={styles.date}>{item.date}</Text>
    <Text style={styles.amount}>{item.amount}</Text>
  </View>

  {item.subItems && item.subItems.map((subItem, subIndex) => (
    <View key={subIndex} style={styles.subItem}>
      <Text style={styles.subIcon}>{subItem.icon}</Text>
      <Text style={styles.subAmount}>{subItem.title}</Text>
    </View>
  ))}
</View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },


  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

    dateAndAmountCont : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  positive: {
    backgroundColor: '#90ee90',
  },
  negative: {
    backgroundColor: '#ffcccb',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  subItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  subIcon: {
    fontSize: 16,
  },
  subAmount: {
    fontSize: 16,
  },
});