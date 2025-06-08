import { ExchangeRate } from '../../domain/entities/ExchangeRate';

export default class ExchangeMapper extends ExchangeRate {
  static fromJson(json) {
    return new ExchangeRate(
      json.id,
      json.base_currency,
      json.target_currency,
      json.rate,
      json.created_at
    );
  }
}
