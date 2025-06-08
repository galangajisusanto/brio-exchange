import ExchangeDataSource from './ExchangeDataSource';
import ApiClient from '../api_client/ApiClient';

/**
 * Exchange Data Source Implementation
 * Handles exchange rate data operations using Supabase API
 */
export default class ExchangeDataSourceImpl extends ExchangeDataSource {

    constructor(apiClient = null) {
        super();
        this.apiClient = apiClient
    }
    async fetchExchangeRates(page = 1) {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const endpoint = `exchange_rates?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`;
            const response = await this.apiClient.get(endpoint);
            return response
        } catch (error) {
            console.log('Failed to fetch exchange rates from API:', error);
            throw new Error(`Repository error: ${error.message}`);
        }
    }

    async deleteExchangeRate(id) {
        try {
            const endpoint = `exchange_rates?id=eq.${id}`;
            const response = await this.apiClient.delete(endpoint);
            return response;
        } catch (error) {
            console.error('Failed to delete exchange rate:', error);
            throw new Error(`Repository error: ${error.message}`);
        }
    }

    async addExchangeRate(body) {
        try {
            const endpoint = 'exchange_rates';
            const response = await this.apiClient.post(endpoint, body);
            return response;
        } catch (error) {
            console.error('Failed to add exchange rate:', error);
            throw new Error(`Repository error: ${error.message}`);
        }
    }

    async fetchCurrencyList() {
        try {
            const endpoint = 'all?fields=currencies';
            const response = await this.apiClient.get(endpoint);
            return response;
        } catch (error) {
            console.error('Failed to fetch country list:', error);
            throw new Error(`Repository error: ${error.message}`);
        }
    }

    async fetchConvertRate(baseCurrency, targetCurrency) {
        try {
            const endpoint = `latest?base_currency=${baseCurrency}&currencies=${targetCurrency}`;
            const response = await this.apiClient.get(endpoint);
            return response;
        } catch (error) {
            console.error('Failed to fetch conversion rate:', error);
            throw new Error(`Repository error: ${error.message}`);
        }
    }
}