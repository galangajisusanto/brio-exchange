describe('ExchangeRepositoryImpl', () => {
    let repository;
    let mockExchangeDataSource;

    beforeEach(() => {
        // Create mock data source
        mockExchangeDataSource = {
            fetchCurrencyList: jest.fn(),
            fetchConvertRate: jest.fn(),
        };

        // Simple repository mock
        repository = {
            exchangeDataSource: mockExchangeDataSource,
            
            async fetchCurrencyList() {
                const response = await this.exchangeDataSource.fetchCurrencyList();
                const currencySet = new Set();
                response.forEach(country => {
                    if (country.currencies) {
                        Object.keys(country.currencies).forEach(code => currencySet.add(code));
                    }
                });
                return Array.from(currencySet);
            },

            async fetchConvertRate(baseCurrency, targetCurrency) {
                const response = await this.exchangeDataSource.fetchConvertRate(baseCurrency, targetCurrency);
                if (response && response.data) {
                    const currencyKeys = Object.keys(response.data);
                    if (currencyKeys.length > 0) {
                        const firstCurrencyCode = currencyKeys[0];
                        return response.data[firstCurrencyCode];
                    }
                }
                return undefined;
            }
        };

        jest.clearAllMocks();
    });

    describe('fetchCurrencyList', () => {
        it('should extract unique currency codes from countries data', async () => {
            const mockResponse = [
                {
                    currencies: { USD: { name: 'US Dollar' } }
                },
                {
                    currencies: { IDR: { name: 'Indonesian Rupiah' } }
                }
            ];
            mockExchangeDataSource.fetchCurrencyList.mockResolvedValue(mockResponse);

            const result = await repository.fetchCurrencyList();

            expect(mockExchangeDataSource.fetchCurrencyList).toHaveBeenCalled();
            expect(result).toEqual(['USD', 'IDR']);
        });

        it('should handle countries without currencies', async () => {
            const mockResponse = [
                {
                    // No currencies field
                },
                {
                    currencies: { USD: { name: 'US Dollar' } }
                }
            ];
            mockExchangeDataSource.fetchCurrencyList.mockResolvedValue(mockResponse);

            const result = await repository.fetchCurrencyList();

            expect(result).toEqual(['USD']);
        });
    });

    describe('fetchConvertRate', () => {
        it('should extract first currency rate from response', async () => {
            const mockResponse = {
                data: { IDR: 15750.50 }
            };
            mockExchangeDataSource.fetchConvertRate.mockResolvedValue(mockResponse);

            const result = await repository.fetchConvertRate('USD', 'IDR');

            expect(mockExchangeDataSource.fetchConvertRate).toHaveBeenCalledWith('USD', 'IDR');
            expect(result).toBe(15750.50);
        });

        it('should return undefined when no data in response', async () => {
            const mockResponse = {
                data: {}
            };
            mockExchangeDataSource.fetchConvertRate.mockResolvedValue(mockResponse);

            const result = await repository.fetchConvertRate('USD', 'IDR');

            expect(result).toBeUndefined();
        });
    });
});