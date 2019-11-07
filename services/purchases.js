import api from './index';

class PurchaseService {
  constructor() {
    this._api = api('purchases');
  }

  async createPurchase(platform, purchase) {
    try {
      let data = {
        platform: platform,
        ...purchase
      }
      return await this._api.post('', data);
    } catch (err) {
      throw err;
    }
  }
}

export default new PurchaseService();