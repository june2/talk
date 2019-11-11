import api from './index';
import { gender } from '../constants/Items';

class UserService {
  constructor() {
    this._api = api('users');
  }

  async getUsers(limit, page, filter) {
    try {
      return await this._api.get(`/?limit=${limit}&page=${page}&q=${filter}`);
    } catch (err) {
      throw err;
    }
  }

  async updateMe(data) {
    try {
      return await this._api.put('/me', data);
    } catch (err) {
      throw err;
    }
  }

  async updatePush(isActivePush) {
    try {
      let data = {
        isActivePush: isActivePush
      }
      return await this._api.put('/me', data);
    } catch (err) {
      throw err;
    }
  }

  async uploadImage(uri) {
    try {
      let formData = new FormData();
      formData.append('upload', { uri: uri, name: 'img.jpg', type: 'image/jpeg' });
      return await this._api.upload('/me/upload', formData);
    } catch (err) {
      throw err;
    }
  }

  async sendImage(uri) {
    try {
      let formData = new FormData();
      formData.append('upload', { uri: uri, name: 'img.jpg', type: 'image/jpeg' });
      return await this._api.upload('/me/upload/image', formData);
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

  async leave() {
    try {
      return await this._api.put('/me/leave');
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