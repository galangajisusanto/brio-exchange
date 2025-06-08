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
    Image
} from 'react-native';
import Colors from '../styles/Colors';
import BrioStyles from '../styles/BrioStyles';
import ExchangeUseCaseFactory from '../../domain/usecases/ExchangeUseCaseFactory';

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
                    <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                    </View>
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
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
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
                <View style={styles.content}>
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
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_LIGHT,
        backgroundColor: Colors.WHITE,
    },
    title: [
        BrioStyles.titleText,
        {
            fontSize: 18,
            fontWeight: '600',
        }
    ],
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.BACKGROUND_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: Colors.TEXT_SECONDARY,
        fontWeight: '600',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: Colors.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_LIGHT,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.BACKGROUND_LIGHT,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
        color: Colors.TEXT_SECONDARY,
    },
    searchInput: [
        BrioStyles.regularText,
        {
            flex: 1,
            fontSize: 16,
            color: Colors.TEXT_PRIMARY,
        }
    ],
    content: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_LIGHT,
    },
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedCurrencyItem: {
        backgroundColor: Colors.PRIMARY_LIGHT || '#E3F2FD',
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
    },
    currencyContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    flagContainer: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: Colors.BACKGROUND_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: Colors.BORDER_LIGHT,
    },
    flagImage: {
        width: '100%',
        height: '100%',
    },
    currencyCode: [
        BrioStyles.subTitleText,
        {
            fontWeight: '600',
            fontSize: 16,
        }
    ],
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkText: {
        color: Colors.WHITE,
        fontSize: 14,
        fontWeight: '600',
    },
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