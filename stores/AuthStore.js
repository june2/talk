import { observable, action, computed, configure } from 'mobx';
import authService from '../services/auth'
import userService from '../services/users'
import config from '../constants/Config';

class AuthStore {
  constructor() {
    this._auth = authService;
    this._user = userService;
  }

  @observable token = null;
  @observable tabBadgeCount = 1;
  @observable slider = [];
  @observable images = [{}, {}, {}, {}, {}, {}];
  @observable me = {
    images: [],
  };

  _updateSlider(images, name) {
    this.slider = [];
    images.forEach((obj, i) => {
      this.images[i] = {
        thumbnail: config.apiHost + obj.thumbnail
      }
      this.slider.push({
        url: config.apiHost + obj.thumbnail,
        title: (i === 0) ? name : '',
      })
    });
  }

  @action async register(email, password) {
    try {
      this.me = await this._auth.register(email, password);
      return this.me;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async getMe() {
    try {
      let res = await this._auth.me();
      this._updateSlider(res.images, res.name);
      this.me = res;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async uploadImage(uri) {
    try {
      let res = await this._user.uploadImage(uri);
      this._updateSlider(res.images, res.name);      
      this.me = res;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }
  @action async deleteImage(index) {
    try {
      this.me.images.splice(index, 1);
      let res = await this._user.deleteImage(this.me.images);
      this.images[index] = {};      
      this._updateSlider(res.data.images, res.data.name);
      this.me = res.data;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

}

const store = new AuthStore();

export default store;