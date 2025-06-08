/**
 * Exchange Data Source Interface
 * Defines the contract for exchange rate data operations
 */
export default class ExchangeDataSource {
  fetchExchangeRates(page = 1) {
    throw new Error('fetchExchangeRates() must be implemented by subclass');
  }
}
