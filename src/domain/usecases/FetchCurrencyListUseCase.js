export default class FetchCurrencyListUseCase {
    constructor(exchangeRepository) {
        this.exchangeRepository = exchangeRepository;
    }

    async execute() {
        try {
            // Add 1 second delay to simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Call repository to fetch currency list
            const result = await this.exchangeRepository.fetchCurrencyList();

            return {
                success: true,
                data: result.data || result,
                message: 'Currency list fetched successfully'
            };
        } catch (error) {
            console.error('Fetch currency list use case error:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch currency list',
                error
            };
        }
    }
}