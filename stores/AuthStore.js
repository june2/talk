import { observable, action, computed, configure } from 'mobx';
import authService from '../services/auth'

class AuthStore {  
  @observable token = null;  
}

const store = new AuthStore();

export default store;