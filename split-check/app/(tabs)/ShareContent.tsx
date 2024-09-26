import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const ShareContent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            setIsVisible(route.name === 'BillDetails');
        });

        return unsubscribe;
    }, [navigation, route]);

    const handleShare = async () => {
        if (route.name === 'BillDetails' && route.params) {
            const { data, total, restaurantInfo, serviceCharge, vat } = route.params as any;

            const message = `
Restaurant: ${restaurantInfo.name}
Table: ${restaurantInfo.tableNumber}
Order: ${restaurantInfo.orderNumber}
Date: ${restaurantInfo.date}
Time: ${restaurantInfo.time}
Waiter: ${restaurantInfo.waiter}

Items:
${data.map((item: any) => `${item.name} x${item.quantity} - $${item.sum}`).join('\n')}

Subtotal: $${total}
Service Charge: $${serviceCharge.amount}
VAT (${vat.rate}%): $${vat.amount}
Total: $${total + serviceCharge.amount + vat.amount}
            `;

            try {
                const result = await Sharing.isAvailableAsync();
                if (result) {
                    await Sharing.shareAsync(message, { dialogTitle: 'Share Bill Details' });
                }
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
    };

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Share Bill</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 80, // Adjust this value to position above the tab bar
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
});

export default ShareContent;