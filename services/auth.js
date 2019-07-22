import axios from 'axios';
import api from './index';

class AuthService {
  constructor() {
    this._api = api('auth');
  }

  async login(email, password) {
    try {
      let data = {
        email: email,
        password: password
      }
      return await this._api.post('/login', data);
    } catch (err) {      
      throw err;
    }    
  }
}

export default new AuthService();