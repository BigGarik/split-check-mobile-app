import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HistoryItem = {
    date: string;
    amount: string;
    positive: boolean;
    subItems?: { title: string; icon: string }[];
};

export default function UserHistory() {
    const historyData: HistoryItem[] = [
        {date: '22.09.2024', amount: '415 600,00', positive: true},
        {
            date: '20.09.2024',
            amount: '329 000,00',
            positive: false,
            subItems: [{title: '146 000,00', icon: '📄'}, {title: '80 000,00', icon: '📊'}]
        },
        {
            date: '20.09.2024',
            amount: '226 000,00',
            positive: false,
            subItems: [{title: '146 000,00', icon: '📄'}, {title: '80 000,00', icon: '📊'}]
        },
        {date: '19.09.2024', amount: '415 600,00', positive: true},
    ];

    const renderItem = ({item}: { item: HistoryItem }) => (
        <View
            style={[
                styles.item,
                item.positive ? styles.positive : styles.negative,
                item.subItems ? styles.withSubItems : null,
            ]}
        >
            <View style={styles.dateAndAmountCont}>
                <Text style={[styles.date, {color: item.positive ? 'black' : 'white'}]}>
                    {item.date}
                </Text>
                <Text style={[styles.amount, {color: item.positive ? 'black' : 'white'}]}>
                    {item.amount}
                </Text>
            </View>
            <View style={styles.hr}/>
            <View style={styles.buttonsAndAmountsCont}>
                <View>
                    {item.positive ? (
                        <TouchableOpacity style={styles.button} onPress={() => alert('in progress')}>
                            <Icon name="receipt" size={24} color="white"/>
                            <Text style={styles.buttonText}>выставить счет</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={() => alert('in progress')}>
                            <Icon name="bell-ring-outline" size={24} color="white"/>
                            <Text style={[styles.buttonText, {color: 'white'}]}>напомнить</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View>
                    {item.subItems &&
                        item.subItems.map((subItem, subIndex) => (
                            <View key={subIndex} style={styles.subItem}>
                                <Text style={[styles.subIcon, {color: item.positive ? 'black' : 'white'}]}>
                                    {subItem.icon}
                                </Text>
                                <Text style={[styles.subAmount, {color: item.positive ? 'black' : 'white'}]}>
                                    {subItem.title}
                                </Text>
                            </View>
                        ))}
                </View>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Мои чеки</Text>
            <FlatList
                data={historyData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    buttonsAndAmountsCont: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent : 'space-between'
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0a84ff',
        padding: 10,
        borderRadius : 10
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color : 'white'
    },

    hr: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 10,
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    dateAndAmountCont: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        minHeight: 100
    },
    positive: {
        backgroundColor: '#90ee90',
    },
    negative: {
        backgroundColor: '#fc5675',
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
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    subIcon: {
        fontSize: 16,

    },
    subAmount: {
        fontSize: 16,
        minWidth: 100,
        justifyContent: 'flex-end',
        display: 'flex',
        textAlign: 'right'
    },
    withSubItems: {
        // Add any specific styles for items with subitems if needed
    },
});