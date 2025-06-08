describe('ExchangeDataSourceImpl', () => {
    let dataSource;
    let mockApiClient;

    beforeEach(() => {
        // Create mock API client
        mockApiClient = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn(),
        };

        // Simple data source mock
        dataSource = {
            apiClient: mockApiClient,

            async fetchExchangeRates(page = 1) {
                const limit = 10;
                const offset = (page - 1) * limit;
                const endpoint = `exchange_rates?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`;
                return await this.apiClient.get(endpoint);
            },

            async deleteExchangeRate(id) {
                const endpoint = `exchange_rates?id=eq.${id}`;
                return await this.apiClient.delete(endpoint);
            },

            async addExchangeRate(body) {
                return await this.apiClient.post('exchange_rates', body);
            },

            async fetchCurrencyList() {
                return await this.apiClient.get('all?fields=currencies');
            },

            async fetchConvertRate(baseCurrency, targetCurrency) {
                const endpoint = `latest?base_currency=${baseCurrency}&currencies=${targetCurrency}`;
                return await this.apiClient.get(endpoint);
            }
        };

        jest.clearAllMocks();
    });

    describe('fetchExchangeRates', () => {
        it('should fetch exchange rates with correct endpoint', async () => {
            const mockResponse = [{ id: '1', rate: 15750.50 }];
            mockApiClient.get.mockResolvedValue(mockResponse);

            const result = await dataSource.fetchExchangeRates();

            expect(mockApiClient.get).toHaveBeenCalledWith(
                'exchange_rates?select=*&order=created_at.desc&limit=10&offset=0'
            );
            expect(result).toEqual(mockResponse);
        });

        it('should handle pagination correctly', async () => {
            mockApiClient.get.mockResolvedValue([]);

            await dataSource.fetchExchangeRates(3);

            expect(mockApiClient.get).toHaveBeenCalledWith(
                'exchange_rates?select=*&order=created_at.desc&limit=10&offset=20'
            );
        });
    });

    describe('deleteExchangeRate', () => {
        it('should delete exchange rate by id', async () => {
            const mockResponse = { success: true };
            mockApiClient.delete.mockResolvedValue(mockResponse);

            const result = await dataSource.deleteExchangeRate('123');

            expect(mockApiClient.delete).toHaveBeenCalledWith('exchange_rates?id=eq.123');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('addExchangeRate', () => {
        it('should add exchange rate with provided data', async () => {
            const exchangeData = { base_currency: 'USD', rate: 15750.50 };
            const mockResponse = { id: '123', ...exchangeData };
            mockApiClient.post.mockResolvedValue(mockResponse);

            const result = await dataSource.addExchangeRate(exchangeData);

            expect(mockApiClient.post).toHaveBeenCalledWith('exchange_rates', exchangeData);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('fetchCurrencyList', () => {
        it('should fetch currency list', async () => {
            const mockResponse = [{ currencies: { USD: {} } }];
            mockApiClient.get.mockResolvedValue(mockResponse);

            const result = await dataSource.fetchCurrencyList();

            expect(mockApiClient.get).toHaveBeenCalledWith('all?fields=currencies');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('fetchConvertRate', () => {
        it('should fetch conversion rate for currency pair', async () => {
            const mockResponse = { data: { IDR: 15750.50 } };
            mockApiClient.get.mockResolvedValue(mockResponse);

            const result = await dataSource.fetchConvertRate('USD', 'IDR');

            expect(mockApiClient.get).toHaveBeenCalledWith(
                'latest?base_currency=USD&currencies=IDR'
            );
            expect(result).toEqual(mockResponse);
        });
    });
});