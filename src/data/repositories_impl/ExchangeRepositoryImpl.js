import ExchangeRepository from '../../domain/repositories/ExchangeRepository.js';
import ExchangeMapper from '../models/ExchangeMapper.js';

export default class ExchangeRepositoryImpl extends ExchangeRepository {

  constructor(exchangeDataSource = null) {
    super();
    this.exchangeDataSource = exchangeDataSource;
  }

  async getExchangeRateList(page = 1) {
    try {
      const rawData = await this.exchangeDataSource.fetchExchangeRates(page);
      return rawData.map(item => ExchangeMapper.fromJson(item));
    } catch (error) {
      console.error('Failed to get exchange rate list:', error);
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async deleteExchangeRate(id) {
    try {
      const response = await this.exchangeDataSource.deleteExchangeRate(id);
      return response;
    } catch (error) {
      console.error('Failed to delete exchange rate:', error);
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async addExchangeRate(body) {
    try {
      const response = await this.exchangeDataSource.addExchangeRate(body);
      return response
    } catch (error) {
      console.error('Failed to add exchange rate:', error);
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async fetchCurrencyList() {
    try {
      const response = await this.exchangeDataSource.fetchCurrencyList();

      const currencySet = new Set();
      response.forEach(country => {
        if (country.currencies) {
          Object.keys(country.currencies).forEach(code => currencySet.add(code));
        }
      });
      const currencyList = Array.from(currencySet);
      console.log('Fetched currency list:', currencyList);
      return currencyList;
    } catch (error) {
      console.error('Failed to fetch country list:', error);
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async fetchConvertRate(baseCurrency, targetCurrency) {
    try {
      const response = await this.exchangeDataSource.fetchConvertRate(baseCurrency, targetCurrency);
      if (response && response.data) {
        const currencyKeys = Object.keys(response.data);
        if (currencyKeys.length > 0) {
          const firstCurrencyCode = currencyKeys[0];
          const firstCurrencyValue = response.data[firstCurrencyCode];
          return firstCurrencyValue
        }
      }
    } catch (error) {
      console.error('Failed to fetch convert rate:', error);
      throw new Error(`Repository error: ${error.message}`);
    }
  }

}