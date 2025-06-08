export default class ExchangeRepository {
  getExchangeRateList(page = 1) {
    throw new Error('getExchangeRateList not implemented');
  }

  deleteExchangeRate(id) {
    throw new Error('deleteExchangeRate not implemented');
  }

  addExchangeRate(body) {
    throw new Error('addExchangeRate not implemented');
  }

  fetchCurrencyList() {
    throw new Error('fetchCountyList not implemented');
  }

  fetchConvertRate(baseCurrency, targetCurrency) {
    throw new Error('fetcConvertRate not implemented');
  }

}
