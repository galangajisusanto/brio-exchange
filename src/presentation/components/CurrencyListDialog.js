import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput,
    Modal,
    ActivityIndicator,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import Colors from '../styles/Colors';
import BrioStyles from '../styles/BrioStyles';
import ExchangeUseCaseFactory from '../../domain/usecases/ExchangeUseCaseFactory';
import { Ionicons } from '@expo/vector-icons';
import VerticalSpace from './VerticalSpace';

export default function CurrencyListDialog({
    visible,
    onClose,
    onSelect,
    selectedCurrency = null,
    title = "Main currency",
}) {
    const [currencies, setCurrencies] = useState([]);
    const [filteredCurrencies, setFilteredCurrencies] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const exchangeUseCaseFactory = new ExchangeUseCaseFactory();
    const fetchCurrencyListUseCase = exchangeUseCaseFactory.createCurencyListUseCase();

    useEffect(() => {
        if (visible) {
            loadCurrencies();
        }
    }, [visible]);

    useEffect(() => {
        filterCurrencies();
    }, [searchText, currencies]);

    const loadCurrencies = async () => {
        try {
            setIsLoading(true);
            const result = await fetchCurrencyListUseCase.execute();

            if (result.success) {
                setCurrencies(result.data);
            } else {
                Alert.alert('Error', 'Failed to load currencies');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load currencies');
        } finally {
            setIsLoading(false);
        }
    };
    const filterCurrencies = () => {
        let filtered = currencies;
        // Filter by search text
        if (searchText.trim()) {
            filtered = filtered.filter(currency => currency.toLowerCase().includes(searchText.toLowerCase()));
        }
        setFilteredCurrencies(filtered);
    };

    const handleSelect = (currency) => {
        onSelect(currency);
        setSearchText('');
        onClose();
    };

    const getFlagUrl = (currencyCode) => {
        return `https://wise.com/public-resources/assets/flags/rectangle/${currencyCode.toLowerCase()}.png`;
    };

    const renderCurrencyItem = ({ item }) => {
        const isSelected = selectedCurrency === item;

        return (
            <TouchableOpacity
                style={[
                    styles.currencyItem,
                    isSelected && styles.selectedCurrencyItem
                ]}
                onPress={() => handleSelect(item)}
            >
                <View style={styles.currencyContent}>
                    <View style={styles.flagContainer}>
                        <Image
                            source={{ uri: getFlagUrl(item) }}
                            style={styles.flagImage}
                            resizeMode="cover"
                            onError={(error) => {
                                console.log(`Failed to load flag for ${item}:`, error.nativeEvent.error);
                            }}
                        />
                    </View>
                    <Text style={styles.currencyCode}>{item}</Text>
                </View>
                {isSelected && (
                    <Ionicons
                        name="checkmark"
                        size={16}
                        color={Colors.COFFEE_700}
                    />

                )}
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No currencies found</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="overFullScreen"
            onRequestClose={onClose}
            transparent={true}
        >
            <View style={styles.modalContainer}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={BrioStyles.handle} />
                    <VerticalSpace height={15} />
                    <Text style={styles.title}>{title}</Text>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color={Colors.TEXT_SECONDARY}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            value={searchText}
                            onChangeText={setSearchText}
                            autoCapitalize="none"
                            placeholderTextColor={Colors.TEXT_SECONDARY}
                        />
                    </View>
                </View>

                {/* Content */}
                <View style={BrioStyles.container}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.PRIMARY} />
                            <Text style={styles.loadingText}>Loading currencies...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredCurrencies}
                            renderItem={renderCurrencyItem}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={renderEmptyState}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden', // Important to clip the content to the rounded corners
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: [
        BrioStyles.titleText,
        {
            fontSize: 16,
        }
    ],
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: Colors.WHITE,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Colors.BORDER_LIGHT,
    },
    searchInput: [
        BrioStyles.regularText,
        {
            flex: 1,
        }
    ],
    listContainer: {
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingText: [
        BrioStyles.regularText,
        {
            marginTop: 12,
            color: Colors.TEXT_SECONDARY,
            textAlign: 'center',
        }
    ],
    currencyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: Colors.WHITE,
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 12,

    },
    selectedCurrencyItem: {
        backgroundColor: Colors.COFFEE_200,
        borderWidth: 1,
        borderColor: Colors.COFFEE_400,
    },
    currencyContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    flagContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.BACKGROUND_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: Colors.BORDER_LIGHT,
    },
    flagImage: {
        width: '100%',
        height: '100%',
    },
    currencyCode: [
        BrioStyles.regularText,
    ],
    separator: {
        height: 1,
        backgroundColor: 'transparent',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyText: [
        BrioStyles.regularText,
        {
            color: Colors.TEXT_SECONDARY,
            textAlign: 'center',
        }
    ],
});