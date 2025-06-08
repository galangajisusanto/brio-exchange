import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Platform,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import VerticalSpace from '../components/VerticalSpace';
import BrioStyles from '../styles/BrioStyles';
import ExchangeUseCaseFactory from '../../domain/usecases/ExchangeUseCaseFactory';
import CurrencyListDialog from '../components/CurrencyListDialog';

export default function AddExchangeScreen({ navigation, route }) {
    const [formData, setFormData] = useState({
        mainCurrency: null,
        convertToCurrency: null,
        rate: null
    });
    const [showMainCurrencyDialog, setShowMainCurrencyDialog] = useState(false);
    const [showConvertToDialog, setShowConvertToDialog] = useState(false);
    const [isLoadingRate, setIsLoadingRate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const exchangeUseCaseFactory = new ExchangeUseCaseFactory();
    const addExchangeUseCase = exchangeUseCaseFactory.createAddExchangeUseCase();
    const convertExchangeUseCase = exchangeUseCaseFactory.createConvertRateUseCase();

    // Auto-fetch exchange rate when both currencies are selected
    useEffect(() => {
        if (formData.mainCurrency && formData.convertToCurrency) {
            fetchExchangeRate();
        } else {
            setFormData(prev => ({ ...prev, rate: null }));
        }
    }, [formData.mainCurrency, formData.convertToCurrency]);

    const fetchExchangeRate = async () => {
        try {
            setIsLoadingRate(true);
            const result = await convertExchangeUseCase.execute(
                formData.mainCurrency,
                formData.convertToCurrency
            );

            if (result.success) {
                setFormData(prev => ({ ...prev, rate: result.data }));
            } else {
                console.error('Failed to fetch exchange rate:', result.message);
                setFormData(prev => ({ ...prev, rate: null }));
            }
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            setFormData(prev => ({ ...prev, rate: null }));
        } finally {
            setIsLoadingRate(false);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleMainCurrencySelect = (currency) => {
        setFormData(prev => ({
            ...prev,
            mainCurrency: currency,
            // Clear rate when currency changes
            rate: null
        }));
        setShowMainCurrencyDialog(false);
    };

    const handleConvertToSelect = (currency) => {
        setFormData(prev => ({
            ...prev,
            convertToCurrency: currency,
            // Clear rate when currency changes
            rate: null
        }));
        setShowConvertToDialog(false);
    };

    const handleAddToExchangeList = async () => {
        if (!formData.mainCurrency || !formData.convertToCurrency) {
            Alert.alert('Error', 'Please select both currencies');
            return;
        }

        if (!formData.rate) {
            Alert.alert('Error', 'Exchange rate is required');
            return;
        }

        try {
            setIsSubmitting(true);
            const exchangeData = {
                baseCurrency: formData.mainCurrency,
                targetCurrency: formData.convertToCurrency,
                rate: formData.rate
            };

            const result = await addExchangeUseCase.execute(exchangeData);

            if (result.success) {
                Alert.alert(
                    'Success',
                    'Exchange rate added successfully',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                const { onExchangeAdded } = route.params || {};
                                if (onExchangeAdded) {
                                    onExchangeAdded();
                                }
                                navigation.goBack();
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error('Error adding exchange rate:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFlagUrl = (currencyCode) => {
        return `https://wise.com/public-resources/assets/flags/rectangle/${currencyCode.toLowerCase()}.png`;
    };

    const renderCurrencySelector = (currency, label, onPress) => (
        <View style={styles.currencySelectorContainer}>
            <Text style={styles.sectionLabel}>{label}</Text>
            <TouchableOpacity style={styles.currencySelector} onPress={onPress}>
                {currency ? (
                    <View style={styles.selectedCurrencyContainer}>
                        <View style={styles.flagContainer}>
                            <Image
                                source={{ uri: getFlagUrl(currency) }}
                                style={styles.flagImage}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={styles.selectedCurrencyText}>{currency}</Text>
                    </View>
                ) : (
                    <Text style={styles.chooseCurrencyText}>+ Choose</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderExchangeRate = () => {
        if (!formData.mainCurrency || !formData.convertToCurrency) {
            return (
                <View style={styles.rateInfoContainer}>
                    <View style={styles.rateInfoBar} />
                    <Text style={styles.rateInfoText}>
                        To display an indicative rate, make sure main and conversion currency have been selected
                    </Text>
                </View>
            );
        }

        if (isLoadingRate) {
            return (
                <View style={styles.rateLoadingContainer}>
                    <ActivityIndicator size="small" color={Colors.PRIMARY} />
                    <Text style={styles.rateLoadingText}>Fetching exchange rate...</Text>
                </View>
            );
        }

        if (formData.rate) {
            return (
                <View style={styles.rateDisplayContainer}>
                    <Text style={styles.rateDisplayText}>
                        1 {formData.mainCurrency} = {formData.rate} {formData.convertToCurrency}
                    </Text>
                    <Text style={styles.rateDisplayText}>
                        1 {formData.convertToCurrency} = {(1 / formData.rate).toFixed(6)} {formData.mainCurrency}
                    </Text>
                    <TouchableOpacity onPress={fetchExchangeRate} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={16} color={Colors.PRIMARY} />
                        <Text style={styles.refreshText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.rateErrorContainer}>
                <Text style={styles.rateErrorText}>Failed to fetch exchange rate</Text>
                <TouchableOpacity onPress={fetchExchangeRate} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const isFormValid = formData.mainCurrency && formData.convertToCurrency && formData.rate;

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

                {/* Currency Selection Container */}
                <View style={styles.currencyContainer}>
                    {/* Main Currency */}
                    {renderCurrencySelector(
                        formData.mainCurrency,
                        "Main currency",
                        () => setShowMainCurrencyDialog(true)
                    )}

                    <VerticalSpace height={24} />

                    {/* Exchange Icon */}
                    <View style={styles.exchangeIconContainer}>
                        <View style={styles.exchangeIcon}>
                            <Ionicons name="swap-vertical" size={24} color={Colors.WHITE} />
                        </View>
                    </View>

                    <VerticalSpace height={24} />

                    {/* Convert To Currency */}
                    {renderCurrencySelector(
                        formData.convertToCurrency,
                        "Convert to",
                        () => setShowConvertToDialog(true)
                    )}

                    <VerticalSpace height={32} />
                </View>

                {/* Indicative Exchange Rate */}
                <View style={styles.rateSection}>
                    <Text style={styles.rateSectionTitle}>Indicative Exchange Rate</Text>
                    <VerticalSpace height={18} />
                    {renderExchangeRate()}
                </View>

                <VerticalSpace height={60} />
            </ScrollView>

            {/* Add Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        BrioStyles.primaryButton,
                        {
                            backgroundColor: isFormValid ? Colors.GREEN : Colors.GREEN_500,
                            opacity: isSubmitting ? 0.7 : 1
                        }
                    ]}
                    onPress={handleAddToExchangeList}
                    disabled={!isFormValid || isSubmitting}
                >
                    {isSubmitting ? (
                        <View style={styles.submitButtonContent}>
                            <ActivityIndicator size="small" color={Colors.WHITE} />
                            <Text style={[styles.addButtonText, { marginLeft: 8 }]}>Adding...</Text>
                        </View>
                    ) : (
                        <Text style={styles.addButtonText}>Add to exchange list</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Currency Dialogs */}
            <CurrencyListDialog
                visible={showMainCurrencyDialog}
                onClose={() => setShowMainCurrencyDialog(false)}
                onSelect={handleMainCurrencySelect}
                selectedCurrency={formData.mainCurrency}
                title="Main currency"
            />

            <CurrencyListDialog
                visible={showConvertToDialog}
                onClose={() => setShowConvertToDialog(false)}
                onSelect={handleConvertToSelect}
                selectedCurrency={formData.convertToCurrency}
                title="Convert to"
            />
        </SafeAreaView>
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
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    currencySelectorContainer: {
        width: '100%',
    },
    sectionLabel: [
        BrioStyles.regularText,
        {
            color: Colors.COFFEE_500,
            marginBottom: 12,
            fontSize: 14,
        }
    ],
    currencySelector: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.BACKGROUND_LIGHT,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.BORDER_LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 60,
    },
    selectedCurrencyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagContainer: {
        width: 32,
        height: 24,
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 12,
        borderWidth: 0.5,
        borderColor: Colors.BORDER_LIGHT,
    },
    flagImage: {
        width: '100%',
        height: '100%',
    },
    selectedCurrencyText: [
        BrioStyles.subTitleText,
        {
            fontSize: 16,
            fontWeight: '600',
            color: Colors.TEXT_PRIMARY,
        }
    ],
    chooseCurrencyText: {
        fontSize: 16,
        color: Colors.ORANGE_500,
        fontWeight: '500',
    },
    exchangeIconContainer: {
        alignItems: 'center',
    },
    exchangeIcon: {
        width: 48,
        height: 48,
        backgroundColor: Colors.GRAY,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateSection: {
        width: '100%',
        marginTop: 24,
    },
    rateSectionTitle: {
        fontSize: 16,
        color: Colors.COFFEE_400,
        fontWeight: '500',
    },
    rateInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.BLUE_100,
        borderRadius: 8,
        padding: 16,
    },
    rateInfoBar: {
        width: 4,
        backgroundColor: Colors.BLUE_600,
        marginRight: 12,
        borderRadius: 2,
        minHeight: 40,
    },
    rateInfoText: [
        BrioStyles.regularText,
        {
            flex: 1,
            color: Colors.BLUE_600,
        },
    ],
    rateLoadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.YELLOW_100,
        borderRadius: 8,
        padding: 16,
    },
    rateLoadingText: [
        BrioStyles.regularText,
        {
            marginLeft: 12,
            color: Colors.YELLOW_800,
        },
    ],
    rateDisplayContainer: {
        backgroundColor: Colors.GREEN_100,
        borderRadius: 8,
        padding: 16,
    },
    rateDisplayText: [
        BrioStyles.subTitleText,
        {
            color: Colors.GREEN_800,
            fontWeight: '600',
            marginBottom: 8,
        }
    ],
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    refreshText: [
        BrioStyles.captionText,
        {
            marginLeft: 4,
            color: Colors.PRIMARY,
            fontWeight: '500',
        }
    ],
    rateErrorContainer: {
        backgroundColor: Colors.RED_100,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    rateErrorText: [
        BrioStyles.regularText,
        {
            color: Colors.RED_800,
            marginBottom: 8,
        }
    ],
    retryButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: Colors.RED_600,
        borderRadius: 6,
    },
    retryText: [
        BrioStyles.captionText,
        {
            color: Colors.WHITE,
            fontWeight: '500',
        }
    ],
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    submitButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: [BrioStyles.primaryButtonText, { fontSize: 16 }],
});