import { observable, action, computed, configure } from 'mobx';
import authService from './../services/auth'
import userService from './../services/users'

// configure({ enforceActions: 'observed' });

class UserStore {
  constructor() {
    this._auth = authService;
    this._user = userService;
  }
  @observable me = {
    images: []
  };
  @observable users = [];
  @observable token = null;
  // @computed get selectedId() { return this.selectedUser.id; }
  @action async getMe() {
    try {
      let res = await this._auth.me();
      console.log(res);
      this.me = res;
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