import { Platform, Alert } from 'react-native';
import { AdMobRewarded } from 'react-native-admob'
import { observable, action, computed, configure, autorun } from 'mobx';
import firebase from 'react-native-firebase';
import authService from '../services/auth'
import userService from '../services/users'
import purchaseService from '../services/purchases'
import config from '../constants/Config'

const notifications = firebase.notifications();
const notif = new firebase.notifications.Notification();

class AuthStore {
  constructor() {
    this._auth = authService;
    this._user = userService;
    this._purchase = purchaseService;
    this._hasCompletedReward = false;
    this._advert = Platform.OS === 'android' ? firebase.admob().rewarded(config.rewardUnitId) : null
    autorun(() => {
      if (Number.isInteger(this.me.tabBadgeCount)) {
        if (Platform.OS === 'android') {
          notif.android.setChannelId('app-infos');
          notifications.displayNotification(notif);
          notifications.setBadge(this.me.tabBadgeCount);
        } else {
          notif.ios.setBadge(this.me.tabBadgeCount);
          notifications.displayNotification(notif);
        }
      }
    });
  }

  _rewardPoint = async () => {
    let res = await this._user.updateRewardPoint();
    if (res.data && res.data.reward) {
      this.me.point = res.data.point;
      this._hasCompletedReward = true;
    }
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

  @action async updateRewardPoint() {
    try {
      if (this.token) {
        return this._user.updateRewardPoint();
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

  @action async reqAdMobReward() {
    try {
      if (Platform.OS === 'ios') {
        AdMobRewarded.setAdUnitID(config.rewardUnitId);
        AdMobRewarded.requestAd();
        AdMobRewarded.addEventListener('adClosed', () => {
          AdMobRewarded.requestAd();
          if (this._hasCompletedReward) return Alert.alert('10 포인트 충전되었습니다!');
          else return Alert.alert('광고를 시청해야 포인트가 충전됩니다.');
        });
        AdMobRewarded.addEventListener('rewarded', () => this._rewardPoint());
      } else {
        const AdRequest = firebase.admob.AdRequest;
        const request = new AdRequest();
        this._advert.loadAd(request.build());
        this._advert.on('onAdClosed', () => {
          const request = new AdRequest();
          this._advert.loadAd(request.build());
          if (this._hasCompletedReward) return Alert.alert('10 포인트 충전되었습니다!');
          else return Alert.alert('광고를 시청해야 포인트가 충전됩니다.');
        });
        this._advert.on('onRewarded', async () => await this._rewardPoint());
      }
    } catch (err) {
      throw err;
    }
  }

  @action async showAdMobReward() {
    try {
      this._hasCompletedReward = false;
      if (Platform.OS === 'ios') {
        AdMobRewarded.showAd().catch(() => Alert.alert('처리 중입니다, 다시 시도해주세요!'));
      } else {
        if (this._advert.isLoaded()) {
          this._advert.show();
        } else {
          return Alert.alert('처리 중입니다, 다시 시도해주세요!');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  @action async removeAdMobReward() {
    if (Platform.OS === 'ios') {
      AdMobRewarded.removeAllListeners();
    }
  }

}

const store = new AuthStore();

export default store;