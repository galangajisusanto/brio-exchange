export default class AddExchangeUseCase {
    constructor(exchangeRepository) {
        this.exchangeRepository = exchangeRepository;
    }

    async execute(exchangeData) {
        try {
            // Validate input data
            const validation = this._validateExchangeData(exchangeData);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.message,
                    error: new Error(validation.message)
                };
            }

            // Normalize the data
            const normalizedData = this._normalizeExchangeData(exchangeData);

            // Add 1.5 second delay to simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Call repository to add the exchange rate
            const result = await this.exchangeRepository.addExchangeRate(normalizedData);

            return {
                success: true,
                data: result,
                message: 'Exchange rate added successfully'
            };
        } catch (error) {
            console.error('Add exchange use case error:', error);
            return {
                success: false,
                message: error.message || 'Failed to add exchange rate',
                error
            };
        }
    }

    _validateExchangeData(data) {
        console.log('Validating exchange data:', data);
        if (!data) {
            return { isValid: false, message: 'Exchange data is required' };
        }

        const { baseCurrency, targetCurrency, rate } = data;

        if (!baseCurrency || baseCurrency.trim() === '') {
            return { isValid: false, message: 'Base currency is required' };
        }

        if (!targetCurrency || targetCurrency.trim() === '') {
            return { isValid: false, message: 'Target currency is required' };
        }

        if (baseCurrency.trim().toUpperCase() === targetCurrency.trim().toUpperCase()) {
            return { isValid: false, message: 'Base and target currencies must be different' };
        }

        if (!rate || isNaN(rate) || parseFloat(rate) <= 0) {
            return { isValid: false, message: 'Rate must be a positive number' };
        }

        return { isValid: true, message: 'Valid' };
    }

    _normalizeExchangeData(data) {
        return {
            base_currency: data.baseCurrency.trim().toUpperCase(),
            target_currency: data.targetCurrency.trim().toUpperCase(),
            rate: parseFloat(data.rate),
        };
    }
}