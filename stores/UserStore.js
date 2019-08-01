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

  _updateSlider(images) {
    this.slider = [];
    images.forEach(obj => {
      this.slider.push({ url: config.apiHost + obj.thumbnail })
    });
  }

  @action async setUser(user) {
    try {
      this._updateSlider(user.images);
      this.user = user;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async getUsers() {
    try {
      this.users = await this._user.getUsers();
      return this.users;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }
}

const store = new UserStore();

export default store;