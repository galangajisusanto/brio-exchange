export class ExchangeRate {
  constructor(id, baseCurrency, targetCurrency, rate, createAt) {
    this.id = id;
    this.baseCurrency = baseCurrency;
    this.targetCurrency = targetCurrency;
    this.rate = rate;
    this.createAt = createAt;
  }
}
