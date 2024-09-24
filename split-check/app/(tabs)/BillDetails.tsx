import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {RouteProp} from '@react-navigation/native';

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

// Helper function to format numbers as "5 100,00"
const formatNumber = (number: number) => {
    return number
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const BillDetails: React.FC<Props> = ({route}) => {
    const {data, total} = route.params;
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({});
    const [yourSum, setYourSum] = useState<number>(0);

    const default_test_VAT = 12

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

            return {
                ...prev,
                [item.position]: newQuantity
            };
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

            return {
                ...prev,
                [item.position]: newQuantity
            };
        });
    };

    const calculateVAT = (amount: number) => {

        return amount * 0.12; //0,1,-1, null
    };

    const totalWithVAT = total + calculateVAT(total);

    const renderItem = ({item, index}: { item: Item; index: number }) => {

        const rowStyle = [
            styles.row,
            index === data.length - 1 && styles.lastRow,
            selectedItems[item.position] ? styles.selectedRow : null
        ];

        const currentQuantity = selectedItems[item.position] || 0;

        return (
            <View style={rowStyle}>
                <Text style={[styles.text, styles.nameColumn]} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </Text>
                <View style={styles.quantityAndAmount}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => handleDecrement(item)}
                            style={[styles.button, currentQuantity === 0 && styles.disabledButton]}
                            disabled={currentQuantity === 0}
                        >
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>

                        <Text style={[styles.text, styles.quantityText]}>
                            {currentQuantity} / {item.quantity}
                        </Text>

                        <TouchableOpacity onPress={() => handleIncrement(item)} style={styles.button}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.text, styles.priceColumn, styles.boldText]}>
                        {formatNumber(item.price)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>

            <View>
                <View style={styles.sumContainer}>
                    <Text style={[styles.text, styles.flexEnd]}>Ваша сумма: </Text>
                    <Text style={styles.yourSum}>{formatNumber(yourSum)}</Text>
                </View>

                <View style={styles.sumContainer}>
                    <Text style={[styles.yourSum, styles.textTwenty]}>Всего выбрано</Text>
                    <Text style={styles.yourSum}> {formatNumber(99999)}</Text>
                </View>
            </View>

            <View style={styles.tableContainer}>

                <View style={styles.listContainer}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.position.toString()}
                        extraData={selectedItems}
                    />
                </View>


                {/*Fix height*/}
                <View>
                    <View style={styles.sumContainer}>
                        <Text style={[styles.ratio, styles.noBoldText]}>Полная сумма</Text>
                        <Text style={[styles.ratio, styles.noBoldText]}>{formatNumber(total)}</Text>
                    </View>
                    <View style={styles.sumContainer}>
                        <Text style={[styles.ratio, styles.noBoldText]}>НДС 12%</Text>
                        <Text style={[styles.ratio, styles.noBoldText]}>+ {formatNumber(calculateVAT(total))}</Text>
                    </View>
                    <View style={styles.sumContainer}>
                        <Text style={[styles.ratio, styles.textTwenty]}>ИТОГО:</Text>
                        <Text style={[styles.ratio, styles.textTwenty]}>
                            {formatNumber(yourSum)}/{formatNumber(totalWithVAT)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    quantityAndAmount: {
        display: 'flex',
        flexDirection: 'row',
        flex: 2,
        alignSelf: 'flex-end',
        width: '65%',
        marginTop: 5
    },

    flexEnd: {
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 30,
        backgroundColor: '#fff',
    },
    textTwenty: {
        fontSize: 20
    },

    sumContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    noBoldText: {
        fontWeight: 'normal',
    },

    smallText: {
        fontSize: 14,
    },

    yourSum: {
        fontSize: 24,
        marginBottom: 5,
        fontWeight: 'bold',
    },

    tableContainer: {
        backgroundColor: '#fff',
    },

    head: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginBottom: 10,
    },

    row: {
        flexDirection: 'column',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        marginBottom: 5,
    },

    lastRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },

    selectedRow: {
        backgroundColor: '#d3f0d2',
    },

    text: {
        fontSize: 17,
    },

    nameColumn: {
        flex: 1,
        alignSelf: 'flex-start',
    },

    quantityColumn: {
        flex: 1,
        textAlign: 'center',
    },

    priceColumn: {
        flex: 1,
        textAlign: 'right',
        justifyContent: 'flex-end',
    },

    button: {
        backgroundColor: '#34c759',
        borderRadius: 50,
        minWidth: 32,
        minHeight: 32,
        maxWidth: 32,
        maxHeight: 32,
        alignItems: 'center',
        justifyContent: 'center'
    },

    boldText: {
        fontWeight: 'bold',

    },

    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },

    disabledButton: {
        backgroundColor: '#bee9c9',
        minWidth: 32,
        minHeight: 32,
    },

    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    quantityText: {
        fontSize: 14,
        paddingHorizontal: 5,
        minWidth: 50,
        textAlign: 'center',
    },

    ratio: {
        fontSize: 17,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    listContainer: {
        maxHeight: '100%'
    },
});

export default BillDetails;
