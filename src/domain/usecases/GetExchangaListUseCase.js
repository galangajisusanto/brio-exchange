export default class GetExchangaListUseCase {
  constructor(exchangeRepository) {
    this.exchangeRepository = exchangeRepository;
  }

  async execute(page = 1) {
    try {

      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await this.exchangeRepository.getExchangeRateList(page);
      return {
        success: true,
        data: result.data || result,
        message: 'Exchange rates loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load exchange rates',
        error
      };
    }
  }
}