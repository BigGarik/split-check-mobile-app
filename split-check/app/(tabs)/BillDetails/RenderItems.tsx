import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { getCurrencyFormatter } from './CurrencyFormatters';
import { Ionicons } from '@expo/vector-icons';

type Item = {
    position: number;
    name: string;
    quantity: number;
    price: number;
    sum: number;
};

type BillItemProps = {
    item: Item;
    selectedItems: { [key: number]: number };
    splitQuantities: { [key: number]: number };
    handleIncrement: (item: Item) => void;
    handleDecrement: (item: Item) => void;
    handleSplitChange: (item: Item, newSplitQuantity: number) => void;
    currencyCode: string;
};

export const BillItem: React.FC<BillItemProps> = ({
    item,
    selectedItems,
    splitQuantities,
    handleIncrement,
    handleDecrement,
    handleSplitChange,
    currencyCode
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const currentQuantity = selectedItems[item.position] || 0;
    const splitQuantity = splitQuantities[item.position] || item.quantity;
    const splitPrice = item.sum / splitQuantity;
    const totalPrice = splitPrice * currentQuantity;

    const formatter = getCurrencyFormatter(currencyCode);

    const handleSplitIncrement = () => {
        handleSplitChange(item, Math.min(splitQuantity + 1, 10));
    };

    const handleSplitDecrement = () => {
        handleSplitChange(item, Math.max(splitQuantity - 1, 1));
    };

    return (
        <View style={[styles.row, currentQuantity > 0 && styles.selectedRow]}>
            <Text style={styles.nameColumn}>{item.name}</Text>

            <View style={styles.quantityAndAmount}>
                <View>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.splitButton}
                    >
                        <Ionicons name="cut-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={() => handleDecrement(item)}
                        style={[styles.button, currentQuantity === 0 && styles.disabledButton]}
                        disabled={currentQuantity === 0}
                    >
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                        <Text style={styles.redFontColor}>{currentQuantity}</Text>/{splitQuantity}
                    </Text>
                    <TouchableOpacity
                        onPress={() => handleIncrement(item)}
                        style={[styles.button, currentQuantity === splitQuantity && styles.disabledButton]}
                        disabled={currentQuantity === splitQuantity}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.priceInfo}>
                    <Text style={styles.priceColumn}>
                        <Text style={styles.redFontColor}>{formatter.from(totalPrice)}</Text>
                    </Text>
                    {/*<Text style={styles.splitPriceText}>*/}
                    {/*    ({formatter.from(splitPrice)} x {currentQuantity})*/}
                    {/*</Text>*/}
                    <Text style={styles.totalPriceText}>/ {formatter.from(item.sum)}</Text>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adjust Split Quantity</Text>
                        <View style={styles.splitControls}>
                            <TouchableOpacity onPress={handleSplitDecrement} style={styles.splitControlButton}>
                                <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.splitQuantityText}>{splitQuantity}</Text>
                            <TouchableOpacity onPress={handleSplitIncrement} style={styles.splitControlButton}>
                                <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    splitControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    splitControlButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    splitQuantityText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 20,
    },
    closeButton: {
        backgroundColor: '#4a90e2',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
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
    selectedRow: {
        backgroundColor: '#a7e0a5',
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
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 14,
        paddingHorizontal: 10,
        minWidth: 45,
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
        borderRadius: 50,
        width: 35,
        height: 35,
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
    splitButton: {
        backgroundColor: '#4a90e2',
        padding: 5,
        borderRadius: 50,
        marginBottom: 5,
    },
    splitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    priceInfo: {
        alignItems: 'flex-end',
    },
    splitPriceText: {
        fontSize: 12,
        color: '#666',
    },
    totalPriceText: {
        fontSize: 14,
        color: '#666',
    },
});