import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getCurrencyFormatter} from './CurrencyFormatters';

type PersonBill = {
    id: string;
    name: string;
    amount: number;
    items?: { name: string; quantity: number; price: number }[];
};

const people: PersonBill[] = [
    {
        id: '1',
        name: 'Eduard',
        amount: 15600,
        items: [{name: 'Печеный батат', quantity: 1, price: 1600}, {name: 'Бешбармак', quantity: 1, price: 7400}]
    },
    {
        id: '2',
        name: 'Igor',
        amount: 9000,
        items: [{name: 'Печеный батат', quantity: 1, price: 1600}, {name: 'Бешбармак', quantity: 1, price: 7400}]
    },
    {id: '3', name: 'Shawn', amount: 0},
];

const SplitBillDetails: React.FC = () => {
    const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
    const [currencyCode, setCurrencyCode] = useState<string>('');

    const totalBill = 24600;
    const totalWithService = 36960;

    const formatter = getCurrencyFormatter(currencyCode);

    const renderPersonBill = ({item}: { item: PersonBill }) => (
        <View style={styles.personContainer}>
            <TouchableOpacity onPress={() => setExpandedPerson(expandedPerson === item.id ? null : item.id)}>
                <View style={styles.personHeader}>
                    <Text style={styles.personName}>{item.name}</Text>
                    <Text style={styles.personAmount}>{formatter.from(item.amount)}</Text>
                </View>
                <Text style={styles.expandText}>
                    <Text>{expandedPerson === item.id ? 'Свернуть' : 'Детально'}</Text>
                    <Ionicons name={expandedPerson === item.id ? 'chevron-up' : 'chevron-down'} size={16} style={styles.marginChevron}/>
                </Text>
            </TouchableOpacity>
            {expandedPerson === item.id && item.items && (
                <View style={styles.itemsList}>
                    {item.items.map((subItem, index) => (
                        <View key={index} style={styles.subItem}>
                            <Text>{`${index + 1}. ${subItem.name}`}</Text>
                            <Text>{`${subItem.quantity}  ${formatter.from(subItem.price)}`}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ИТОГО по чеку</Text>
                <Text style={styles.headerTotal}>
                    {formatter.from(totalBill)}/{formatter.from(totalWithService)}
                </Text>
            </View>
            <FlatList
                data={people}
                renderItem={renderPersonBill}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    marginChevron : {
        marginTop : 3
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        gap: 5
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerTotal: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    personContainer: {
        marginVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        overflow: 'hidden',
        minHeight : 100
    },
    personHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    personName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    personAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    expandText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'left',
        paddingRight: 16,
        paddingLeft: 16,
        paddingBottom: 8,
        alignItems : 'center',
        display : 'flex'
    },
    itemsList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    subItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});

export default SplitBillDetails;