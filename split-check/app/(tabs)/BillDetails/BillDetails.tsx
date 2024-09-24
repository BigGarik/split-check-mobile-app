import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { renderItem } from './RenderItems';
import { formatCurrency } from 'react-native-format-currency';

type RootStackParamList = {
    BillDetails: {
        data: { position: number; name: string; quantity: number; price: number; sum: number }[];
        total: number
    };
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

const BillDetails: React.FC<Props> = ({route}) => {
    const {data, total} = route.params;
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({});
    const [yourSum, setYourSum] = useState<number>(0);

    useEffect(() => {
        const sum = Object.entries(selectedItems).reduce((acc, [position, quantity]) => {
            const item = data.find(item => item.position === Number(position));
            return acc + (item ? item.price * quantity : 0);
        }, 0);
        setYourSum(sum);
    }, [selectedItems, data]);

    const handleIncrement = (item: Item) => {
        setSelectedItems(prev => {
            const currentQuantity = prev[item.position] || 0;
            const newQuantity = Math.min(currentQuantity + 1, item.quantity);
            return {...prev, [item.position]: newQuantity};
        });
    };

    const handleDecrement = (item: Item) => {
        setSelectedItems(prev => {
            const currentQuantity = prev[item.position] || 0;
            const newQuantity = Math.max(currentQuantity - 1, 0);
            if (newQuantity === 0) {
                const {[item.position]: _, ...rest} = prev;
                return rest;
            }
            return {...prev, [item.position]: newQuantity};
        });
    };
    const VAT_RATE = 12;

    const calculateVAT = (amount: number) => (amount * VAT_RATE) / 100;
    const totalWithVAT = total + calculateVAT(total);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.sumContainer}>
                    <Text style={styles.sumLabel}>Ваша сумма </Text>
                    <Text style={styles.sumValue}>
                        {formatCurrency({code: "RUB", amount: yourSum})[1]}
                    </Text>
                </View>
                <View style={styles.sumContainer}>
                    <Text style={styles.sumLabel}>Всего выбрано</Text>
                    <Text style={styles.sumValue}>{formatCurrency({ amount: 99999, code: "RUB"})[1]}</Text>
                </View>
            </View>

            <View style={styles.listContainer}>
                <FlatList
                    data={data}
                    renderItem={({ item, index }) => renderItem({
                        item,
                        index,
                        selectedItems,
                        handleIncrement,
                        handleDecrement,
                    })}
                    keyExtractor={(item) => item.position.toString()}
                    extraData={selectedItems}
                />
            </View>

            <View style={styles.footer}>
                <View style={styles.sumContainer}>
                    <Text style={styles.footerLabel}>Полная сумма</Text>
                    <Text style={styles.footerValue}>{formatCurrency({ amount: total })[0]}</Text>
                </View>
                <View style={styles.sumContainer}>
                    <Text style={styles.footerLabel}>НДС {VAT_RATE}%</Text>
                    <Text style={styles.footerValue}>+ {formatCurrency({ amount: calculateVAT(total) })[0]}</Text>
                </View>
                <View style={styles.sumContainer}>
                    <Text style={styles.footerTotal}>ИТОГО:</Text>
                    <Text style={styles.footerTotal}>
                        {formatCurrency({ amount: yourSum })[0]}/{formatCurrency({ amount: totalWithVAT })[0]}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    listContainer: {
        flex: 1,
    },
    footer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        justifyContent: 'space-around',
    },
    sumContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sumLabel: {
        fontSize: 18,
    },
    sumValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    footerLabel: {
        fontSize: 16,
    },
    footerValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerTotal: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default BillDetails;