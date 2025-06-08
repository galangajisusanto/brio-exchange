import ExchangeDataSource from './ExchangeDataSource';
import ApiClient from '../api_client/ApiClient';

/**
 * Exchange Data Source Implementation
 * Handles exchange rate data operations using Supabase API
 */
export default class ExchangeDataSourceImpl extends ExchangeDataSource {

    constructor(apiClient = null) {
        super();
        try {
            this.apiClient = apiClient || new ApiClient();
        } catch (error) {
            console.warn('Failed to create API client:', error);
            this.apiClient = null;
        }
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
}