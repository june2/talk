import { observable, action, computed, configure } from 'mobx';
import authService from '../services/auth'
import config from '../constants/Config';

class AuthStore {
  constructor() {
    this._auth = authService;
  }

  @observable token = null;
  @observable slider = [];
  @observable me = {
    images: [],
  };

  _updateSlider(images, name) {
    this.slider = [];
    images.forEach((obj, i) => {
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
}

const store = new AuthStore();

export default store;