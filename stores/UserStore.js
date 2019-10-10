import { observable, action, computed, configure } from 'mobx';
import config from '../constants/Config';
import userService from './../services/users'

class UserStore {
  constructor() {
    this._user = userService;
  }
  @observable user = {
    images: []
  };
  @observable slider = [];
  @observable users = [];
  @observable token = null;
  @observable isChat = false;

  _updateSlider(images, name) {
    this.slider = [];
    images.forEach((obj, i) => {
      this.slider.push({
        url: obj,
        // title: (i === 0) ? name : '',
        // caption: 'Caption 3',
      })
    });
  }

  @action async setUser(user, isChat = false) {
    try {
      this._updateSlider(user.images, user.name);
      this.user = user;
      this.isChat = isChat;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async getUsers(limit = 20, offset = 0) {
    try {
      this.users = await this._user.getUsers(limit, offset);
      return this.users;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async updateUser(name, location, intro, gender, birthday) {
    try {
      return this.users = await this._user.updateMe(
        name, location,
        intro, gender,
        birthday);
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async updatePushToken(os, version, pushToken) {
    try {
      return this.users = await this._user.updatePushToken(os, version, pushToken);
    } catch (err) {
      console.log(err)
      // Alert.alert('Error', err.message)
    }
  }
}

const store = new UserStore();

export default store;