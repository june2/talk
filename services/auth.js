import api from './index';

class AuthService {
  constructor() {
    this._api = api('auth');
  }

  async register(email, password, name, gender, birthday, location,
    locale, region, platformOS, platformVer, pushToken) {
    try {
      let data = {
        email: email,
        password: password,
        name: name,
        gender: gender,
        birthday: birthday,
        location: location,
        locale: locale, 
        region: region,
        platformOS: platformOS,
        platformVer: platformVer + '',
        pushToken: pushToken
      }
      return await this._api.post('/register', data);
    } catch (err) {
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