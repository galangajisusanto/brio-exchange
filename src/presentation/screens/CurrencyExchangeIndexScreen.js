import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import Colors from '../styles/Colors';
import VerticalSpace from '../components/VerticalSpace';
import BrioStyles from '../styles/BrioStyles';
import ExchangeItem from '../components/ExchangeItem';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import ExchangeUseCaseFactory from '../../domain/usecases/ExchangeUseCaseFactory';

export default function CurrencyExchangeScreen({ navigation }) {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        visible: false,
        itemId: null,
    });

    const exchangeUseCaseFactory = new ExchangeUseCaseFactory();
    const getExchangeListUseCase = exchangeUseCaseFactory.createGetExchangeListUseCase();

    useEffect(() => {
        loadExchangeRates();
    }, []);

    const loadExchangeRates = async (page = 1, isLoadMore = false) => {
        try {
            if (page === 1) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            const result = await getExchangeListUseCase.execute(page);

            if (result.success) {
                // Make sure we're getting the data array correctly
                const newData = result.data || [];
                if (isLoadMore) {
                    setExchangeRates(prevData => {
                        const updatedData = [...prevData, ...newData];
                        return updatedData;
                    });

                } else {
                    setExchangeRates(newData);
                }

                // Update pagination info
                setCurrentPage(page);
                setHasMoreData(newData.length > 0);
            } else {
                Alert.alert('Error', result.message);
                if (page === 1) {
                    setExchangeRates([]);
                }
            }
        } catch (error) {
            console.error('Error loading exchange rates:', error);
            Alert.alert('Error', 'Failed to load exchange rates');
            if (page === 1) {
                setExchangeRates([]);
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setCurrentPage(1);
        await loadExchangeRates(1, false);
    };

    const handleLoadMore = async () => {
        if (!isLoadingMore && hasMoreData) {
            const nextPage = currentPage + 1;
            await loadExchangeRates(nextPage, true);
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

    const confirmDelete = async () => {
        if (deleteDialog.itemId) {
            try {
                // TODO: Call delete API here
                // await deleteExchangeUseCase.execute(deleteDialog.itemId);

                // Remove from local state
                setExchangeRates(prev => prev.filter(item => item.id !== deleteDialog.itemId));
                console.log('Deleted exchange rate:', deleteDialog.itemId);

                // If we deleted the last item on current page and not on page 1, go to previous page
                const remainingItems = exchangeRates.filter(item => item.id !== deleteDialog.itemId);
                if (remainingItems.length === 0 && currentPage > 1) {
                    const prevPage = currentPage - 1;
                    setCurrentPage(prevPage);
                    await loadExchangeRates(prevPage, false);
                }
            } catch (error) {
                console.error('Error deleting exchange rate:', error);
                Alert.alert('Error', 'Failed to delete exchange rate');
            }
        }
        setDeleteDialog({ visible: false, itemId: null });
    };

    const cancelDelete = () => {
        setDeleteDialog({ visible: false, itemId: null });
    };

    const renderLoadMoreFooter = () => {
        if (!isLoadingMore) return null;

        return (
            <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color={Colors.PRIMARY} />
                <Text style={styles.loadMoreText}>Loading more...</Text>
            </View>
        );
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

    const renderPaginationInfo = () => {
        if (exchangeRates.length === 0) return null;

        return (
            <View style={styles.paginationInfo}>
                <Text style={BrioStyles.captionText}>
                    {exchangeRates.length} Exchange
                </Text>
            </View>
        );
    };

    // Loading indicator for initial load (page = 1)
    const renderInitialLoading = () => (
        <View style={styles.initialLoadingContainer}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text style={styles.initialLoadingText}>Loading exchange rates...</Text>
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

            {/* Pagination Info */}
            {renderPaginationInfo()}

            {/* Content */}
            <View style={styles.content}>
                {isLoading ? (
                    renderInitialLoading()
                ) : exchangeRates.length === 0 && !isLoading ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={exchangeRates}
                        renderItem={renderExchangeItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}

                        // Pagination props
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1} // Trigger when 10% from bottom
                        ListFooterComponent={renderLoadMoreFooter}

                        // Pull to refresh
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}

                        // Performance optimizations
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={50}
                        initialNumToRender={10}
                        windowSize={10}
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

    // Loading styles
    initialLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    initialLoadingText: [
        BrioStyles.regularText,
        {
            marginTop: 16,
            color: Colors.TEXT_SECONDARY,
            textAlign: 'center',
        }
    ],

    // Pagination styles
    paginationInfo: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    paginationText: [
        BrioStyles.captionText,
    ],
    loadMoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadMoreText: [
        BrioStyles.regularText,
        {
            marginLeft: 8,
            color: Colors.TEXT_SECONDARY,
        }
    ],
    loadMoreButtonContainer: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: Colors.BACKGROUND,
    },
    loadMoreButton: {
        backgroundColor: Colors.BACKGROUND_LIGHT,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    loadMoreButtonText: [
        BrioStyles.regularText,
        {
            color: Colors.PRIMARY,
            fontWeight: '600',
        }
    ],
});