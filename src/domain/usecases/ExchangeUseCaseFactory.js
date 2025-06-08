import ApiClient from '../../data/api_client/ApiClient';
import ExchangeDataSourceImpl from '../../data/datasources/ExchangeDataSourceImpl';
import ExchangeRepositoryImpl from '../../data/repositories_impl/ExchangeRepositoryImpl';
import GetExchangaListUseCase from './GetExchangaListUseCase';
import DeleteExchangeUseCase from './DeleteExchangeUseCase';
import AddExchangeUseCase from './AddExchangeUseCase';
import FetchConvertRateUseCase from './FetchConvertRateUseCase';
import FetchCurrencyListUseCase from './FetchCurrencyListUseCase';

export default class ExchangeUseCaseFactory {
    constructor() {
        this._getExchangeListUseCase = null;
        this._deleteExchangeUseCase = null;
        this._addExchangeUseCase = null;
        this._fetchCountryListUseCase = null;
        this._fetchConvertRateUseCase = null;
    }

    _generateDefaultApiClient() {
        return new ApiClient();
    }

    _generateRestCountriesApiClient() {
        return new ApiClient('https://restcountries.com/v3.1/all');
    }

    _generateFreeCurrencyApiClient() {
        return new ApiClient('https://api.freecurrencyapi.com/v1/', 'fca_live_lW1BOpaYIVJW4RdtOuxskO6Vtq9OJbxO9FAndiqE');
    }

    _getExchangeDataSource(apiClient) {
        return new ExchangeDataSourceImpl(apiClient);
    }

    _getExchangeRepository(apiClient) {
        const dataSource = this._getExchangeDataSource(apiClient);
        return new ExchangeRepositoryImpl(dataSource);
    }

    // Create and return GetExchangeListUseCase instance
    createGetExchangeListUseCase() {
        if (!this._getExchangeListUseCase) {
            this._getExchangeListUseCase = new GetExchangaListUseCase(
                this._getExchangeRepository(this._generateDefaultApiClient())
            );
        }
        return this._getExchangeListUseCase;
    }

    createDeleteExchangeUseCase() {
        if (!this._deleteExchangeUseCase) {
            this._deleteExchangeUseCase = new DeleteExchangeUseCase(
                this._getExchangeRepository(this._generateDefaultApiClient())
            );
        }
        return this._deleteExchangeUseCase;
    }

    createAddExchangeUseCase() {
        if (!this._addExchangeUseCase) {
            this._addExchangeUseCase = new AddExchangeUseCase(
                this._getExchangeRepository(this._generateDefaultApiClient())
            );
        }
        return this._addExchangeUseCase;
    }

    createCurencyListUseCase() {
        if (!this._fetchCountryListUseCase) {
            this._fetchCountryListUseCase = new FetchCurrencyListUseCase(
                this._getExchangeRepository(this._generateRestCountriesApiClient())
            );
        }
        return this._fetchCountryListUseCase;
    }

    createConvertRateUseCase() {
        if (!this._fetchConvertRateUseCase) {
            this._fetchConvertRateUseCase = new FetchConvertRateUseCase(
                this._getExchangeRepository(this._generateFreeCurrencyApiClient())
            );
        }
        return this._fetchConvertRateUseCase;
    }

    // Reset factory (useful for testing)
    reset() {
        this._getExchangeListUseCase = null;
        this._deleteExchangeUseCase = null;
        this._addExchangeUseCase = null;
        this._fetchCountryListUseCase = null;
        this._fetchConvertRateUseCase = null;
    }
}