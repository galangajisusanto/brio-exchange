import ApiClient from '../../data/api_client/ApiClient';
import ExchangeDataSourceImpl from '../../data/datasources/ExchangeDataSourceImpl';
import ExchangeRepositoryImpl from '../../data/repositories_impl/ExchangeRepositoryImpl';
import GetExchangaListUseCase from './GetExchangaListUseCase';

// Simple implementations without inheritance - working versions
class SimpleExchangeDataSource {
    constructor() {
        // No dependencies, just mock data
    }

    async fetchExchangeRates(page = 1) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockRates = [
            { id: '1', baseCurrency: 'USD', targetCurrency: 'IDR', rate: 15750.50, createdAt: '2025-06-05T09:41:00Z' },
            { id: '2', baseCurrency: 'EUR', targetCurrency: 'IDR', rate: 17200.30, createdAt: '2025-06-05T09:41:00Z' },
            { id: '3', baseCurrency: 'SGD', targetCurrency: 'IDR', rate: 11650.75, createdAt: '2025-06-05T09:41:00Z' },
            { id: '4', baseCurrency: 'JPY', targetCurrency: 'IDR', rate: 105.25, createdAt: '2025-06-05T09:41:00Z' },
        ];

        return {
            data: mockRates,
            page: page,
            totalPages: 1,
            totalItems: mockRates.length
        };
    }
}

class SimpleExchangeRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    async getExchangeRateList(page = 1) {
        try {
            const result = await this.dataSource.fetchExchangeRates(page);
            return result;
        } catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    }
}

export default class ExchangeUseCaseFactory {
    constructor() {
        this._exchangeDataSource = null;
        this._exchangeRepository = null;
        this._getExchangeListUseCase = null;
    }

    _getExchangeDataSource() {
        if (!this._exchangeDataSource) {
            // Use SimpleExchangeDataSource instead of imported one
            this._exchangeDataSource = new ExchangeDataSourceImpl(new ApiClient());
        }
        return this._exchangeDataSource;
    }

    _getExchangeRepository() {
        if (!this._exchangeRepository) {
            // Use SimpleExchangeRepository instead of imported one
            this._exchangeRepository = new ExchangeRepositoryImpl(
                this._getExchangeDataSource()
            );
        }
        return this._exchangeRepository;
    }

    // Create and return GetExchangeListUseCase instance
    createGetExchangeListUseCase() {
        if (!this._getExchangeListUseCase) {
            this._getExchangeListUseCase = new GetExchangaListUseCase(
                this._getExchangeRepository()
            );
        }
        return this._getExchangeListUseCase;
    }

    // Reset factory (useful for testing)
    reset() {
        this._exchangeDataSource = null;
        this._exchangeRepository = null;
        this._getExchangeListUseCase = null;
    }
}