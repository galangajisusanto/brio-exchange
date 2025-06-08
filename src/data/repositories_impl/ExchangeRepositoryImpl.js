import ExchangeRepository from '../../domain/repositories/ExchangeRepository.js';
import ExchangeMapper from '../models/ExchangeMapper.js';

export default class ExchangeRepositoryImpl extends ExchangeRepository {

  constructor(exchangeDataSource = null) {
    super();
    this.exchangeDataSource = exchangeDataSource;
  }

  getExchangeRateList
  async getExchangeRateList(page = 1) {
    try {
      const rawData = await this.exchangeDataSource.fetchExchangeRates(page);
      return rawData.map(item => ExchangeMapper.fromJson(item));
    } catch (error) {
      console.error('Failed to get exchange rate list:', error);
      throw new Error(`Repository error: ${error.message}`);
    }
  }

}