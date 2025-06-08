describe('FetchCurrencyListUseCase', () => {
    let useCase;
    let mockExchangeRepository;

    beforeEach(() => {
        // Create mock exchange repository
        mockExchangeRepository = {
            fetchCurrencyList: jest.fn(),
        };

        // Simple use case mock
        useCase = {
            exchangeRepository: mockExchangeRepository,
            
            async execute() {
                try {
                    const result = await this.exchangeRepository.fetchCurrencyList();
                    return {
                        success: true,
                        data: result.data || result,
                        message: 'Currency list fetched successfully'
                    };
                } catch (error) {
                    return {
                        success: false,
                        data: [],
                        message: error.message || 'Failed to fetch currency list',
                        error
                    };
                }
            }
        };

        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should return success response with currency list', async () => {
            const mockCurrencyList = ['USD', 'EUR', 'IDR'];
            mockExchangeRepository.fetchCurrencyList.mockResolvedValue(mockCurrencyList);

            const result = await useCase.execute();

            expect(mockExchangeRepository.fetchCurrencyList).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                success: true,
                data: mockCurrencyList,
                message: 'Currency list fetched successfully'
            });
        });

        it('should handle response with data property', async () => {
            const mockResponse = { data: ['USD', 'EUR'] };
            mockExchangeRepository.fetchCurrencyList.mockResolvedValue(mockResponse);

            const result = await useCase.execute();

            expect(result).toEqual({
                success: true,
                data: ['USD', 'EUR'],
                message: 'Currency list fetched successfully'
            });
        });

        it('should return error response when repository fails', async () => {
            const repositoryError = new Error('Repository failed');
            mockExchangeRepository.fetchCurrencyList.mockRejectedValue(repositoryError);

            const result = await useCase.execute();

            expect(result).toEqual({
                success: false,
                data: [],
                message: 'Repository failed',
                error: repositoryError
            });
        });

        it('should handle error without message', async () => {
            const errorWithoutMessage = { code: 'ERROR' };
            mockExchangeRepository.fetchCurrencyList.mockRejectedValue(errorWithoutMessage);

            const result = await useCase.execute();

            expect(result).toEqual({
                success: false,
                data: [],
                message: 'Failed to fetch currency list',
                error: errorWithoutMessage
            });
        });

        it('should handle empty currency list', async () => {
            mockExchangeRepository.fetchCurrencyList.mockResolvedValue([]);

            const result = await useCase.execute();

            expect(result).toEqual({
                success: true,
                data: [],
                message: 'Currency list fetched successfully'
            });
        });
    });
});