import { observable, action, computed, configure } from 'mobx';
import authService from './../services/auth'
import userService from './../services/users'

// configure({ enforceActions: 'observed' });

class UserStore {
  constructor() {    
    this._user = userService;
  }
  @observable user = {
    images: []
  };
  @observable users = [];
  @observable token = null;
  // @computed get selectedId() { return this.selectedUser.id; }
    
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