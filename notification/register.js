import { Component } from 'react';
import { observer } from 'mobx-react';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import UserStore from '../stores/UserStore';

@observer
export default class Notification extends Component {
  constructor(data) {
    super(data);
    this._register();
  }

  _register() {
    firebase.messaging().requestPermission().then(() => {
      firebase.messaging().getToken().then(token => {        
        UserStore.updatePushToken(Platform.OS, Platform.Version, token);
      })
    }).catch(error => {
      console.log(error)
    })
  }
}
