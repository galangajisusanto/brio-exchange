import ApiClient from '../../data/api_client/ApiClient';
import ExchangeDataSourceImpl from '../../data/datasources/ExchangeDataSourceImpl';
import ExchangeRepositoryImpl from '../../data/repositories_impl/ExchangeRepositoryImpl';
import GetExchangaListUseCase from './GetExchangaListUseCase';
import DeleteExchangeUseCase from './DeleteExchangeUseCase';


export default class ExchangeUseCaseFactory {
    constructor() {
        this._exchangeDataSource = null;
        this._exchangeRepository = null;
        this._getExchangeListUseCase = null;
        this._deleteExchangeUseCase = null;
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

    createDeleteExchangeUseCase() {
        if (!this._deleteExchangeUseCase) {
            this._deleteExchangeUseCase = new DeleteExchangeUseCase(
                this._getExchangeRepository()
            );
        }
        return this._deleteExchangeUseCase;
    }

    // Reset factory (useful for testing)
    reset() {
        this._exchangeDataSource = null;
        this._exchangeRepository = null;
        this._getExchangeListUseCase = null;
        this._deleteExchangeUseCase = null;
    }
}