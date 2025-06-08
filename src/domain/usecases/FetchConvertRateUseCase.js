export default class FetchConvertRateUseCase {
  constructor(exchangeRepository) {
    this.exchangeRepository = exchangeRepository;
  }

  async execute(baseCurrency, targetCurrency) {
    try {
      // Validate input parameters
      const validation = this._validateCurrencies(baseCurrency, targetCurrency);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message,
          error: new Error(validation.message)
        };
      }

      // Normalize currency codes
      const normalizedBaseCurrency = baseCurrency.trim().toUpperCase();
      const normalizedTargetCurrency = targetCurrency.trim().toUpperCase();

      // Add 1.5 second delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call repository to fetch conversion rate
      const result = await this.exchangeRepository.fetchConvertRate(
        normalizedBaseCurrency, 
        normalizedTargetCurrency
      );

      return {
        success: true,
        data: result,
        baseCurrency: normalizedBaseCurrency,
        targetCurrency: normalizedTargetCurrency,
        message: 'Conversion rate fetched successfully'
      };
    } catch (error) {
      console.error('Fetch convert rate use case error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch conversion rate',
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
        error
      };
    }
  }

  _validateCurrencies(baseCurrency, targetCurrency) {
    if (!baseCurrency || baseCurrency.trim() === '') {
      return { isValid: false, message: 'Base currency is required' };
    }

    if (!targetCurrency || targetCurrency.trim() === '') {
      return { isValid: false, message: 'Target currency is required' };
    }

    if (baseCurrency.trim().toUpperCase() === targetCurrency.trim().toUpperCase()) {
      return { isValid: false, message: 'Base and target currencies must be different' };
    }

    // Validate currency code format (3 letters)
    const currencyPattern = /^[A-Z]{3}$/;
    if (!currencyPattern.test(baseCurrency.trim().toUpperCase())) {
      return { isValid: false, message: 'Base currency must be a valid 3-letter code (e.g., USD)' };
    }

    if (!currencyPattern.test(targetCurrency.trim().toUpperCase())) {
      return { isValid: false, message: 'Target currency must be a valid 3-letter code (e.g., IDR)' };
    }

    return { isValid: true, message: 'Valid' };
  }
}