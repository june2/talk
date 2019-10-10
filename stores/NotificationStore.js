import { observable, action, computed, configure } from 'mobx';
import {
  Animated
} from 'react-native';
import config from '../constants/Config';
import userService from '../services/users'
import { hide } from 'expo/build/launch/SplashScreen';

class NotificationStore {
  constructor() {
  }
  @observable isVisible = true;
  @observable opacity = new Animated.Value(0);
  @observable text = '메시지가 도착했습니다.!';

  @action show() {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {this._hide()});    
  }

  _hide() {
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

}

const store = new NotificationStore();

export default store;