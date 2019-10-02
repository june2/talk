import api from './index';
import { gender } from '../constants/Items';

class UserService {
  constructor() {
    this._api = api('users');
  }

  async getUsers(limit, offset) {
    try {
      return await this._api.get(`/?limit=${limit}&offset=${offset}`);
    } catch (err) {
      throw err;
    }
  }

  async updateMe(name, location, intro, gender, birthday) {
    try {
      let data = {
        name: name,
        location: location,
        intro: intro,
        gender: gender,
        birthday: birthday,
      }
      return await this._api.put('/me', data);
    } catch (err) {
      throw err;
    }
  }

  async uploadImage(uri) {
    try {
      let formData = new FormData();
      formData.append('upload', { uri: uri, name: 'img.jpg', type: 'image' });
      return await this._api.upload('/me/upload', formData);
    } catch (err) {
      throw err;
    }
  }

  async deleteImage(images) {
    try {
      let data = {
        images: images
      }
      return await this._api.put('/me', data);
    } catch (err) {
      throw err;
    }
  }

  async updateLastLogin() {
    try {
      return await this._api.put('/me/updateLastLogin');
    } catch (err) {
      throw err;
    }
  }

  async updatePushToken(os, version, pushToken) {
    try {
      let data = {
        PlatformOS: os,
        PlatformVer: version,
        pushToken: pushToken,
      }
      return await this._api.put('/me/registerPushToken', data);
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();