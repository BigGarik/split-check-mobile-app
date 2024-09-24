import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatCurrency } from 'react-native-format-currency';
const { FormatMoney } = require('format-money-js');


const currency_formater = new FormatMoney({
    decimals: 2,
    separator: ' ',
    symbol: 'Р',
    append: true
});

const currency_formater_ = new FormatMoney({
    decimals: 2,
    separator: ',',
    symbol: 'som',
    append: true
});

const currency_formater_en = new FormatMoney({
    decimals: 2,
    separator: ',',
    symbol: '$',
    append: false
});


type Item = {
    position: number;
    name: string;
    quantity: number;
    price: number;
    sum: number;
};

type RenderItemProps = {
    item: Item;
    index: number;
    selectedItems: { [key: number]: number };
    handleIncrement: (item: Item) => void;
    handleDecrement: (item: Item) => void;
};

export const renderItem = ({ item, index, selectedItems, handleIncrement, handleDecrement }: RenderItemProps) => {
    const currentQuantity = selectedItems[item.position] || 0;
    const totalPrice = item.price * currentQuantity;

    const [formattedTotalPrice] = formatCurrency({ amount: totalPrice, code:"RUB" });
    const [formattedItemSum] = formatCurrency({ amount: item.sum, code:"RUB" });
    const [formattedItemPrice] = formatCurrency({ amount: item.price, code:"RUB" });



    if (index === 2) {
        return (
            <View style={styles.row}>

                <Text style={styles.nameColumn}>{item.name}</Text>

                <View style={styles.quantityAndAmount}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => handleDecrement(item)}
                            style={[styles.button, currentQuantity === 0 && styles.disabledButton]}
                            disabled={currentQuantity === 0}
                        >
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>
                            <Text style={styles.redFontColor}>{currentQuantity}</Text>/{item.quantity}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleIncrement(item)}
                            style={styles.button}
                            disabled={currentQuantity === item.quantity}
                        >
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.priceColumn}>
                        <Text style={styles.redFontColor}>{formattedTotalPrice}</Text> / <Text>{formattedItemSum}</Text>
                    </Text>

                </View>
            </View>
        );
    } else if (index === 3) {
        return (
            <View style={styles.row}>
                <Text style={styles.nameColumn}>{item.name}</Text>
                <View style={styles.quantityAndAmount}>
                    <Text style={styles.priceColumn}>{formattedTotalPrice}</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => handleDecrement(item)}
                            style={[styles.button, currentQuantity === 0 && styles.disabledButton]}
                            disabled={currentQuantity === 0}
                        >
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>
                            {currentQuantity}/{item.quantity}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleIncrement(item)}
                            style={styles.button}
                            disabled={currentQuantity === item.quantity}
                        >
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.row}>
                <Text style={styles.nameColumn}>{item.name}</Text>
                <View style={styles.quantityAndAmountDefault}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => handleDecrement(item)}
                            style={[styles.button, currentQuantity === 0 && styles.disabledButton]}
                            disabled={currentQuantity === 0}
                        >
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>
                            {currentQuantity}/{item.quantity}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleIncrement(item)}
                            style={styles.button}
                            disabled={currentQuantity === item.quantity}
                        >
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.priceColumn}>{currency_formater.from(item.sum)}</Text>
                </View>
            </View>
        );
    }
};



const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    nameColumn: {
        fontSize: 16,
        flexWrap: 'wrap',
        flex: 1,
        marginBottom: 5,
    },
    quantityAndAmount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },

    quantityAndAmountDefault: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width : '65%',
        alignSelf : 'flex-end'

    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    quantityText: {
        fontSize: 14,
        paddingHorizontal: 10,
        minWidth: 60,
        textAlign: 'center',
    },
    priceColumn: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    redFontColor : {
        color : 'red',
        fontWeight : 'normal'
    },
    button: {
        backgroundColor: '#34c759',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#bee9c9',
    },
    specialRow: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    specialRowSelected: {
        backgroundColor: '#d4edda',
    },
    specialNameColumn: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    specialQuantityAndAmount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    specialButton: {
        backgroundColor: '#28a745',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    specialDisabledButton: {
        backgroundColor: '#a3d7b5',
    },
    specialButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    specialQuantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    specialPriceColumn: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});