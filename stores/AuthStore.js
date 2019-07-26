import { observable, action, computed, configure } from 'mobx';
import authService from '../services/auth'

class AuthStore {
  constructor() {
    this._auth = authService;
  }

  @observable token = null;
  @observable me = {
    images: []
  };

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
      console.log(res);
      this.me = res;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }
}

const store = new AuthStore();

export default store;