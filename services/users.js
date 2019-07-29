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

  async uploadImage(uri) {
    try {
      let formData = new FormData();
      formData.append('file', { uri: uri, name: 'img.jpg', type: 'image' });
      return await this._api.upload('/me/upload', formData);
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();