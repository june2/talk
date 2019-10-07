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
  @observable me = {
    images: [],
    tabBadgeCount: 0
  };

  @action async register(email, password, name, gender, birthday, location) {
    try {
      this.me = await this._auth.register(email, password, name, gender, birthday, location);
      return this.me;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async getMe() {
    try {
      let res = await this._auth.me();      
      this.me = res;
      return this.me;
    } catch (err) {
      return null;
    }
  }

  @action async uploadImage(uri) {
    try {
      let res = await this._user.uploadImage(uri);      
      this.me.images = res.images;           
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async deleteImage(index) {
    try {
      this.me.images.splice(index, 1);
      let res = await this._user.deleteImage(this.me.images); 
      this.me = res.data;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async updateLastLogin() {
    try {
      if (this.token) {
        this._user.updateLastLogin();
      }
    } catch (err) {
      throw err;
    }
  }

  @action async updateName(name) {
    try {
      this.slider[0].title = name;
      this.slider = this.slider;
    } catch (err) {
      throw err;
    }
  }

}

const store = new AuthStore();

export default store;