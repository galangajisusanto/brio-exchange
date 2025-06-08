import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../styles/Colors';
import BrioStyles from '../styles/BrioStyles';
import { Ionicons } from '@expo/vector-icons';

export default function ExchangeItem({ item, onDelete }) {

    const formatRate = (rate) => {
        return parseFloat(rate.toFixed(6)).toString();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <View style={styles.container}>
            {/* Header with currencies and delete button */}
            <View style={styles.header}>
                <View style={styles.currencyPair}>
                    <Text style={BrioStyles.subTitleText}>{item.baseCurrency}</Text>
                    <View style={styles.exchangeIcon}>
                        <Text style={styles.exchangeText}>⇄</Text>
                    </View>
                    <Text style={BrioStyles.subTitleText}>{item.targetCurrency}</Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete && onDelete(item.id)}
                >
                    <Ionicons name="trash-outline" size={24} color={Colors.ERROR} />

                </TouchableOpacity>
            </View>

            {/* Exchange rates */}
            <View style={styles.ratesContainer}>
                <View style={styles.rateRow}>
                    <Text style={styles.fromExchange}>1 {item.baseCurrency}</Text>
                    <Text style={styles.equalSignFrom}>=</Text>
                    <Text style={styles.fromExchange}>{formatRate(item.rate)} {item.targetCurrency}</Text>
                </View>

                <View style={styles.rateRow}>
                    <Text style={BrioStyles.regularText}>1 {item.targetCurrency}</Text>
                    <Text style={styles.equalSignTo}>=</Text>
                    <Text style={BrioStyles.regularText}>{formatRate(1 / item.rate)} {item.baseCurrency}</Text>
                </View>
            </View>

            {/* Created date */}
            <Text style={styles.createdDate}>
                Created {formatDate(item.createAt)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    currencyPair: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exchangeIcon: {
        marginHorizontal: 16,
    },
    exchangeText: {
        fontSize: 24,
        color: Colors.TEXT_SECONDARY,
        fontWeight: '600',
    },
    deleteButton: {
        width: 42,
        height: 38,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.ERROR,
    },
    deleteIcon: {
        fontSize: 16,
        color: '#e74c3c',
    },
    ratesContainer: {
        marginBottom: 16,
    },
    rateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    fromExchange: [
        BrioStyles.subTitleText,
        {
            fontWeight: 400,
            fontSize: 18,
        }
    ],
    equalSignFrom: [
        BrioStyles.subTitleText,
        {
            marginHorizontal: 16,
        }
    ],
    equalSignTo: [
        BrioStyles.regularText,
        {
            fontWeight: "700",
            marginHorizontal: 16,

        }
    ],
    createdDate: [
        BrioStyles.captionText,
        {
            fontWeight: "400",
        }
    ]
});