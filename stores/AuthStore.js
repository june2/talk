import { observable, action, computed, configure } from 'mobx';
import authService from '../services/auth'
import userService from '../services/users'
import purchaseService from '../services/purchases'

class AuthStore {
  constructor() {
    this._auth = authService;
    this._user = userService;
    this._purchase = purchaseService;
  }

  @observable token = null;  
  @observable me = {
    images: [],
    tabBadgeCount: 0,
    point: 0,
  };

  @computed
  get profile() {
    return toJS(this.me)
  }

  @action async register(email, password, name, gender, birthday, location,
    locale, region, platformOS, platformVer, pushToken) {
    try {
      this.me = await this._auth.register(email, password, name, gender, birthday, location,
        locale, region, platformOS, platformVer, pushToken);
      return this.me;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async getMe() {
    try {
      let res = await this._auth.me();
      this.me = res;
      return this.me;
    } catch (err) {
      return null;
    }
  }

  @action async uploadImage(uri) {
    try {
      let res = await this._user.uploadImage(uri);
      this.me.images = res.images;
      return res.images;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async deleteImage(index) {
    try {
      this.me.images.splice(index, 1);
      let res = await this._user.deleteImage(this.me.images);
      this.me = res.data;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async updateMe(data) {
    try {
      let res = await this._user.updateMe(data);
      // console.log(res.data);
      // this.me = Object.assign(this.me, res.data);      
      // console.log(this.me);
      return res;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async updateLastLogin() {
    try {
      if (this.token) {
        return this._user.updateLastLogin();
      }
    } catch (err) {
      throw err;
    }
  }

  @action async leave() {
    try {
      if (this.token) {
        this._user.leave();
      }
    } catch (err) {
      throw err;
    }
  }

  @action async updateName(name) {
    try {
      this.slider[0].title = name;
      this.slider = this.slider;
    } catch (err) {
      throw err;
    }
  }

  @action async updatePoint(point) {
    try {
      this.me.point = point;
    } catch (err) {
      throw err;
    }
  }

  @action async sendImage(uri) {
    try {
      let res = await this._user.sendImage(uri);
      return res.image;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

  @action async purchaseItem(receipt, purchase) {
    try {
      let res = await this._purchase.createPurchase(receipt, purchase);
      return res;
    } catch (err) {
      // Alert.alert('Error', err.message)
      throw err;
    }
  }

}

const store = new AuthStore();

export default store;