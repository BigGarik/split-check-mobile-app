import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getCurrencyFormatter} from './CurrencyFormatters';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/app/(tabs)/_layout";

type GroupBillDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'GroupBillDetails'>;
type GroupBillDetailsRouteProp = RouteProp<RootStackParamList, 'GroupBillDetails'>;

type Props = {
    navigation: GroupBillDetailsNavigationProp;
    route: GroupBillDetailsRouteProp;
};

type PersonBill = {
    id: string;
    name: string;
    amount: number;
    items?: { name: string; quantity: number; price: number }[];
};

const GroupBillDetails: React.FC<Props> = ({route}) => {
    const {selectedItems, yourSum, totalBill, totalWithService} = route.params;
    const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
    const [currencyCode, setCurrencyCode] = useState<string>('');

    const formatter = getCurrencyFormatter(currencyCode);

    const people: PersonBill[] = [
        {id: '1', name: 'You', amount: yourSum, items: selectedItems},
        {
            id: '2',
            name: 'Eduard',
            amount: 15600,
            items: [{name: 'Печеный батат', quantity: 1, price: 1600}, {name: 'Бешбармак', quantity: 1, price: 7400}]
        },
        {
            id: '3',
            name: 'Igor',
            amount: 9000,
            items: [{name: 'Печеный батат', quantity: 1, price: 1600}, {name: 'Бешбармак', quantity: 1, price: 7400}]
        },
        {id: '4', name: 'Shawn', amount: 0},
    ];

    const totalSelectedCost = useMemo(() => {
        return people.reduce((acc, person) => acc + person.amount, 0);
    }, [people]);

    const renderPersonBill = ({item}: { item: PersonBill }) => (
        <View style={styles.personContainer}>
            <TouchableOpacity onPress={() => setExpandedPerson(expandedPerson === item.id ? null : item.id)}>
                <View style={styles.personHeader}>
                    <Text style={styles.personName}>{item.name}</Text>
                    <Text style={styles.personAmount}>{formatter.from(item.amount)}</Text>
                </View>
                <Text style={styles.expandText}>
                    <Text>{expandedPerson === item.id ? 'Свернуть' : 'Детально'}</Text>
                    <Ionicons name={expandedPerson === item.id ? 'chevron-up' : 'chevron-down'} size={16}
                              style={styles.marginChevron}/>
                </Text>
            </TouchableOpacity>
            {expandedPerson === item.id && item.items && (
                <View style={styles.itemsList}>
                    {item.items.map((subItem, index) => (
                        <View key={index} style={styles.subItem}>
                            <Text style={styles.itemName}>{`${index + 1}. ${subItem.name}`}</Text>
                            <Text>{subItem.quantity}  </Text>
                            <Text style={styles.minWidthPrice} >${formatter.from(subItem.price)}</Text>
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
                    {formatter.from(totalSelectedCost)} / {formatter.from(totalBill)}
                </Text>
                <Text style={styles.headerSubtotal}>
                    С обслуживанием: {formatter.from(totalWithService)}
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

    minWidthPrice : {
        minWidth : 100,
        display : 'flex',
        justifyContent : 'flex-end'

    },

    itemName: {
        maxWidth: '60%',
        width: '60%'
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        gap: 5,
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
    headerSubtotal: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    personContainer: {
        marginVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        overflow: 'hidden',
        minHeight: 100,
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
        alignItems: 'center',
        display: 'flex',
    },
    itemsList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    subItem: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent : 'space-between',
        display : 'flex'
    },
    marginChevron: {
        marginTop: 5,
    },
});

export default GroupBillDetails;