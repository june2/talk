import { observable, action } from 'mobx';
import {
  Animated
} from 'react-native';

class NotificationStore {
  constructor() {
    this.isShow = false;
  }

  @observable isVisible = true;
  @observable opacity = new Animated.Value(0);
  @observable text = '메시지가 도착했습니다!';

  @action show() {
    if (!this.isShow) {
      this.isShow = true;
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => { this._hide() });
    }
  }

  _hide() {
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 4000,
      useNativeDriver: true,
    }).start(() => { this.isShow = false })
  }

}

const store = new NotificationStore();

export default store;