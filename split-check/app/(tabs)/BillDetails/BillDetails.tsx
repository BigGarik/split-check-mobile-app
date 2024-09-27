import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app/(tabs)/_layout";
import { getCurrencyFormatter } from './CurrencyFormatters';
import {BillItem} from "@/app/(tabs)/BillDetails/RenderItems";

type BillDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'BillDetails'>;
type BillDetailsRouteProp = RouteProp<RootStackParamList, 'BillDetails'>;

type Props = {
    navigation: BillDetailsNavigationProp;
    route: BillDetailsRouteProp;
};

type Item = {
    position: number;
    name: string;
    quantity: number;
    price: number;
    sum: number;
};

const BillDetails: React.FC<Props> = ({ route, navigation }) => {
    const { data, total, restaurantInfo, serviceCharge, vat } = route.params;
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({});
    const [splitQuantities, setSplitQuantities] = useState<{ [key: number]: number }>({});
    const [yourSum, setYourSum] = useState<number>(0);
    const [currencyCode, setCurrencyCode] = useState<string>('');

    const formatter = getCurrencyFormatter(currencyCode);

    useEffect(() => {
        const sum = Object.entries(selectedItems).reduce((acc, [position, quantity]) => {
            const item = data.find(item => item.position === Number(position));
            if (item) {
                const splitQuantity = splitQuantities[item.position] || item.quantity;
                const splitPrice = item.sum / splitQuantity;
                return acc + (splitPrice * quantity);
            }
            return acc;
        }, 0);
        setYourSum(sum);
    }, [selectedItems, splitQuantities, data]);

    const handleIncrement = (item: Item) => {
        setSelectedItems(prev => {
            const currentQuantity = prev[item.position] || 0;
            const splitQuantity = splitQuantities[item.position] || item.quantity;
            const newQuantity = Math.min(currentQuantity + 1, splitQuantity);
            return { ...prev, [item.position]: newQuantity };
        });
    };

    const handleDecrement = (item: Item) => {
        setSelectedItems(prev => {
            const currentQuantity = prev[item.position] || 0;
            const newQuantity = Math.max(currentQuantity - 1, 0);
            if (newQuantity === 0) {
                const { [item.position]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [item.position]: newQuantity };
        });
    };

    const handleSplitChange = (item: Item, newSplitQuantity: number) => {
        setSplitQuantities(prev => ({
            ...prev,
            [item.position]: newSplitQuantity
        }));
        setSelectedItems(prev => {
            const currentQuantity = prev[item.position] || 0;
            if (currentQuantity > newSplitQuantity) {
                return { ...prev, [item.position]: newSplitQuantity };
            }
            return prev;
        });
    };

     const navigateToGroupBillDetails = () => {
        const selectedItemsDetails = Object.entries(selectedItems).map(([position, quantity]) => {
            const item = data.find(item => item.position === Number(position));
            if (item) {
                const splitQuantity = splitQuantities[item.position] || item.quantity;
                const splitPrice = item.sum / splitQuantity;
                return {
                    name: item.name,
                    quantity: quantity,
                    price: splitPrice * quantity
                };
            }
            return null;
        }).filter((item): item is NonNullable<typeof item> => item !== null);

        navigation.navigate('GroupBillDetails', {
            selectedItems: selectedItemsDetails,
            yourSum: yourSum,
            totalBill: total,
            totalWithService: total + serviceCharge.amount
        });
    };

    const renderItem = ({ item }: { item: Item }) => (
        <BillItem
            item={item}
            selectedItems={selectedItems}
            splitQuantities={splitQuantities}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            handleSplitChange={handleSplitChange}
            currencyCode={currencyCode}
        />
    );

    const VAT_RATE = 12;
    const calculateVAT = (amount: number) => (amount * VAT_RATE) / 100;
    const totalWithVAT = total + calculateVAT(total);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.sumContainer}>
                    <Text style={styles.sumLabel}>Ваша сумма </Text>
                    <Text style={styles.sumValue}>{formatter.from(yourSum)}</Text>
                </View>
                <View style={styles.sumContainer}>
                    <Text style={styles.sumLabel}>Всего выбрано</Text>
                    <TouchableOpacity onPress={navigateToGroupBillDetails}>
                        <Text style={styles.sumValue}>{formatter.from(yourSum)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.hr}/>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.position.toString()}
            />

            <View style={styles.footer}>
                <View style={styles.sumContainer}>
                    <Text style={styles.footerLabel}>Полная сумма</Text>
                    <Text style={styles.footerValue}>{formatter.from(total)}</Text>
                </View>
                <View style={styles.sumContainer}>
                    <Text style={styles.footerLabel}>НДС {VAT_RATE}%</Text>
                    <Text style={styles.footerValue}>+ {formatter.from(calculateVAT(total))}</Text>
                </View>
                <View style={styles.sumContainer}>
                    <Text style={styles.footerTotal}>ИТОГО:</Text>
                    <Text style={styles.footerTotal}>
                        {formatter.from(yourSum)}/{formatter.from(totalWithVAT)}
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
        paddingBottom: 0
    },
    hr: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 10,
        width: '100%',
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