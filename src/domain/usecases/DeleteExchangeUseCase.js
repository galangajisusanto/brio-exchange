export default class DeleteExchangeUseCase {
  constructor(exchangeRepository) {
    this.exchangeRepository = exchangeRepository;
  }

  async execute(exchangeId) {
    try {
      // Validate input
      if (!exchangeId) {
        return {
          success: false,
          message: 'Exchange ID is required',
          error: new Error('Invalid exchange ID')
        };
      }

      // Add 1 second delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call repository to delete the exchange rate
      const result = await this.exchangeRepository.deleteExchangeRate(exchangeId);

      return {
        success: true,
        data: result,
        message: 'Exchange rate deleted successfully',
        deletedId: exchangeId
      };
    } catch (error) {
      console.error('Delete exchange use case error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete exchange rate',
        error,
        deletedId: exchangeId
      };
    }
  }
}