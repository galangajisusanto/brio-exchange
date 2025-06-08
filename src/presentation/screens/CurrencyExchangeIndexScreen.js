import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import Colors from '../styles/Colors';
import VerticalSpace from '../components/VerticalSpace';
import BrioStyles from '../styles/BrioStyles';
import ExchangeItem from '../components/ExchangeItem';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import ExchangeUseCaseFactory from '../../domain/usecases/ExchangeUseCaseFactory';



export default function CurrencyExchangeScreen({ navigation }) {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({
        visible: false,
        itemId: null,
    });

    const exchangeUseCaseFactory = new ExchangeUseCaseFactory();
    const getExchangeListUseCase = exchangeUseCaseFactory.createGetExchangeListUseCase();


    useEffect(() => {
        loadExchangeRates();
    }, []);

    const loadExchangeRates = async () => {
        setIsLoading(true);
        try {
            const result = await getExchangeListUseCase.execute(1);

            if (result.success) {
                setExchangeRates(result.data);
            } else {
                Alert.alert('Error', result.message);
                setExchangeRates([]);
            }
        } catch (error) {
            console.error('Error loading exchange rates:', error);
            Alert.alert('Error', 'Failed to load exchange rates');
            setExchangeRates([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateExchange = () => {
        navigation.navigate('AddExchange');
    };

    const renderExchangeItem = ({ item }) => (
        <ExchangeItem
            item={item}
            onDelete={handleDeleteExchange}
        />
    );

    const handleDeleteExchange = (id) => {
        const item = exchangeRates.find(rate => rate.id === id);
        setDeleteDialog({
            visible: true,
            itemId: id,
        });
    };

    const confirmDelete = () => {
        if (deleteDialog.itemId) {
            setExchangeRates(prev => prev.filter(item => item.id !== deleteDialog.itemId));
            console.log('Deleted exchange rate:', deleteDialog.itemId);
        }
        setDeleteDialog({ visible: false, itemId: null });
    };

    const cancelDelete = () => {
        setDeleteDialog({ visible: false, itemId: null });
    };

    const renderEmptyState = () => (
        <View style={[styles.emptyContainer]}>
            <Image
                source={require('../../../assets/images/empty-illustration.png')}
                resizeMode="contain"
            />
            <VerticalSpace height={28} />
            <Text style={styles.emptyTitle}>No exchange created yet</Text>
            <VerticalSpace height={10} />
            <Text style={styles.emptyDescription}>
                Start define list of the exchange rate that should be used in the expense claim module
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={BrioStyles.header}>
                <Text style={BrioStyles.titleText}>Currencies Exchange</Text>
                <Text style={BrioStyles.regularText}>
                    List of currency pairs to be used for foreign exchange conversion
                </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {exchangeRates.length === 0 && !isLoading ? (
                    renderEmptyState()
                ) : (
                    < FlatList
                        data={exchangeRates}
                        renderItem={renderExchangeItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}

                    />
                )}
            </View>

            {/* Create Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={BrioStyles.primaryButton} onPress={handleCreateExchange}>
                    <Text style={styles.createButton}>Create currency exchange</Text>
                </TouchableOpacity>
            </View>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                visible={deleteDialog.visible}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_LIGHT,
    },
    content: {
        flex: 1,
    },
    emptyContainer: [
        BrioStyles.container,
        {
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 130,
        },

    ],
    emptyDescription: [
        BrioStyles.regularText,
        {
            color: Colors.TEXT_SECONDARY,
            textAlign: 'center'
        }
    ],
    emptyTitle: [
        BrioStyles.regularText,
        {
            fontWeight: '700',
        }
    ],
    bottomContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: Colors.BACKGROUND,
    },
    createButton: [BrioStyles.primaryButtonText, { fontSize: 16 }],
    separator: {
        height: 12,
    },
});