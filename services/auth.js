import api from './index';

class AuthService {
  constructor() {
    this._api = api('auth');
  }

  async register(email, password, name, gender, birthday, location,
    PlatformOS, PlatformVer, pushToken) {
    try {
      let data = {
        email: email,
        password: password,
        name: name,
        gender: gender,
        birthday: birthday,
        location: location,
        PlatformOS: PlatformOS,
        PlatformVer: PlatformVer + '',
        pushToken: pushToken
      }
      return await this._api.post('/register', data);
    } catch (err) {
      console.log(err);
      throw err;
    }
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

  async me() {
    try {
      return await this._api.get('/me');
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();