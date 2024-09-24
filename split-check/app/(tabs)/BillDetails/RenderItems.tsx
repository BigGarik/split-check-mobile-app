import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {getCurrencyFormatter} from './CurrencyFormatters';

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
    currencyCode: string;
};

export const renderItem = ({
                               item,
                               index,
                               selectedItems,
                               handleIncrement,
                               handleDecrement,
                               currencyCode
                           }: RenderItemProps) => {
    const currentQuantity = selectedItems[item.position] || 0;
    const totalPrice = item.price * currentQuantity;

    const formatter = getCurrencyFormatter(currencyCode);

    if (index === 2) {
        const isSelected = currentQuantity >= 1;
        return (
            <View style={[styles.row, isSelected && styles.selectedRow]}>
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
                        <Text
                            style={styles.redFontColor}>{formatter.from(totalPrice)}</Text> / <Text>{formatter.from(item.sum)}</Text>
                    </Text>
                </View>
            </View>
        );
    } else if (index === 3) {
        return (
            <View style={styles.row}>
                <Text style={styles.nameColumn}>{item.name}</Text>
                <View style={styles.quantityAndAmount}>
                    <Text style={styles.priceColumn}>{formatter.from(item.sum)}</Text>
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
                    <Text style={styles.priceColumn}>{formatter.from(item.sum)}</Text>
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
        backgroundColor: '#f7f7f7',
        marginTop: 5,
        marginBottom: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,

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

    selectedRow: {
        backgroundColor: '#a7e0a5',
    },

    quantityAndAmountDefault: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '70%',
        alignSelf: 'flex-end'

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
    redFontColor: {
        color: 'red',
        fontWeight: 'normal'
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