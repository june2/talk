import api from './index';

class UserService {
  constructor() {
    this._api = api('users');
  }

  async getUsers() {
    try {
      return await this._api.get('/');
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();