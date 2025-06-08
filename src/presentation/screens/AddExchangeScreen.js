import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import VerticalSpace from '../components/VerticalSpace';
import BrioStyles from '../styles/BrioStyles';
import ExchangeUseCaseFactory from '../../domain/usecases/ExchangeUseCaseFactory';


export default function AddExchangeScreen({ navigation }) {
    const [mainCurrency, setMainCurrency] = useState(null);
    const [convertToCurrency, setConvertToCurrency] = useState(null);
    const [indicativeRate, setIndicativeRate] = useState(null);

    const exchangeUseCaseFactory = new ExchangeUseCaseFactory();
    const addExchangeUseCase = exchangeUseCaseFactory.createAddExchangeUseCase();
    const convertExchangeUseCase = exchangeUseCaseFactory.createConvertRateUseCase();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleMainCurrencySelect = () => {
        // Navigate to currency selection screen
        // navigation.navigate('CurrencySelection', { 
        //     onSelect: setMainCurrency,
        //     selectedCurrency: mainCurrency 
        // });
    };

    const handleConvertToCurrencySelect = () => {
        // Navigate to currency selection screen
        // navigation.navigate('CurrencySelection', { 
        //     onSelect: setConvertToCurrency,
        //     selectedCurrency: convertToCurrency 
        // });
    };

    const handleAddToExchangeList = () => {
        // if (mainCurrency && convertToCurrency) {
        //     // Add logic to save the exchange pair
        //     navigation.goBack();
        // }
        convertExchangeUseCase.execute(
            "USD",
            "IDR"
            // rate: 15.888,
        ).then(result => {
            if (result.success) {
                console.log('Exchange rate added successfully:', result.data);
                navigation.goBack();
            } else {
                console.error('Failed to add exchange rate:', result.message);
            }
        }).catch(error => {
            console.error('Error adding exchange rate:', error);
        });
    };

    const isFormValid = mainCurrency && convertToCurrency;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <VerticalSpace height={Platform.OS === 'ios' ? 44 : 24} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.BLUE_GRAY_800} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text style={styles.title}>Create currency exchange</Text>
                <VerticalSpace height={12} />
                <Text style={styles.subTitle}>
                    Set the currency conversion that you need and add them to the list
                </Text>

                <VerticalSpace height={40} />

                {/* Main Currency Section */}
                <View style={styles.currencyContainer}>
                    <Text style={styles.sectionLabel}>Main currency</Text>
                    <TouchableOpacity
                        onPress={handleMainCurrencySelect}
                    >
                        <Text style={styles.chooseCurrencyText}>
                            {mainCurrency ? mainCurrency : '+ Choose'}
                        </Text>
                    </TouchableOpacity>
                    <VerticalSpace height={48} />
                    <View style={styles.exchangeIconContainer}>
                        <View style={styles.exchangeIcon}>
                            <Ionicons name="swap-vertical" size={24} color={Colors.WHITE} />
                        </View>
                    </View>
                    {/* Convert To Section */}
                    <Text style={styles.sectionLabel}>Convert to</Text>
                    <TouchableOpacity
                        style={styles.currencySelector}
                        onPress={handleConvertToCurrencySelect}>
                        <Text style={styles.chooseCurrencyText}>
                            {convertToCurrency ? convertToCurrency : '+ Choose'}
                        </Text>
                    </TouchableOpacity>
                    <VerticalSpace height={48} />
                </View>

                {/* Indicative Exchange Rate */}
                <View style={styles.rateSection}>
                    <Text style={styles.rateSectionTitle}>Indicative Exchange Rate</Text>
                    <VerticalSpace height={18} />
                    <View style={styles.rateInfoContainer}>
                        <View style={styles.rateInfoBar} />
                        <Text style={styles.rateInfoText}>
                            To display an indicative rate, make sure main and conversion currency have been selected
                        </Text>
                    </View>
                </View>

                <VerticalSpace height={60} />
            </ScrollView>

            {/* Add Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[BrioStyles.primaryButton, { backgroundColor: isFormValid ? Colors.GREEN : Colors.GREEN_500 }]}
                    onPress={handleAddToExchangeList}
                // disabled={!isFormValid}
                >
                    <Text style={styles.addButtonText}>Add to exchange list</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
    },
    header: {
        marginHorizontal: 20,
        marginBottom: 30,
        marginTop: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: [
        BrioStyles.subTitleText,
        { textAlign: 'center' },
    ],
    subTitle: [
        BrioStyles.regularText,
        { textAlign: 'center' },
    ],
    currencyContainer: {
        width: '100%',
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
    },
    sectionLabel: [
        BrioStyles.regularText,
        {
            color: Colors.COFFEE_500,
            marginTop: 28,
            marginHorizontal: 24,
            marginBottom: 8,
        }
    ],
    chooseCurrencyText: {
        fontSize: 16,
        color: Colors.ORANGE_500,
        fontWeight: '500',
        alignSelf: 'center',
    },
    exchangeIconContainer: {
        alignItems: 'center',
    },
    exchangeIcon: {
        width: 60,
        height: 60,
        backgroundColor: Colors.GRAY,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateSection: {
        width: '100%',
    },
    rateSectionTitle: {
        fontSize: 16,
        color: Colors.COFFEE_400,
        fontWeight: '500',
        marginTop: 30,
    },
    rateInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.BLUE_100,
    },
    rateInfoBar: {
        width: 4,
        backgroundColor: Colors.BLUE_600,
        marginRight: 12,
        borderRadius: 2,
        minHeight: 60,
    },
    rateInfoText: [
        BrioStyles.regularText,
        {
            flex: 1,
            color: Colors.BLUE_600,
        },
    ],
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },

    addButtonText: [BrioStyles.primaryButtonText, { fontSize: 16 }],
});