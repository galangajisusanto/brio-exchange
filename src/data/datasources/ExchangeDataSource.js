/**
 * Exchange Data Source Interface
 * Defines the contract for exchange rate data operations
 */
export default class ExchangeDataSource {
  fetchExchangeRates(page = 1) {
    throw new Error('fetchExchangeRates() must be implemented by subclass');
  }

  deleteExchangeRate(id) {
    throw new Error('deleteExchangeRate() must be implemented by subclass');
  }

  addExchangeRate(body) {
    throw new Error('addExchangeRate() must be implemented by subclass');
  }

  fetchCurrencyList() {
    throw new Error('fetchCountyList() must be implemented by subclass');
  }

  fetchConvertRate(baseCurrency, targetCurrency) {
    throw new Error('fetcgConvertRate() must be implemented by subclass');
  }

}
