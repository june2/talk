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

  @action async setUser(user) {
    try {
      this._updateSlider(user.images, user.name);
      this.user = user;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async getUsers(limit, offset) {
    try {
      this.users = await this._user.getUsers(limit, offset);
      return this.users;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async updateUser(name, location, intro, gender, age) {
    try {
      return this.users = await this._user.updateMe(
        name, location,
        intro, gender,
        new Date(`${age}-01-01`));
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