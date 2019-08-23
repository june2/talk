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
  // @computed get selectedId() { return this.selectedUser.id; }

  _updateSlider(images, name) {
    this.slider = [];
    images.forEach((obj, i) => {
      this.slider.push({
        url: config.apiHost + obj.thumbnail,
        title: (i === 0) ? name : '',
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
}

const store = new UserStore();

export default store;