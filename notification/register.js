import { Component } from 'react';
import { observer } from 'mobx-react';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import authStore from '../stores/AuthStore';

@observer
export default class Notification extends Component {
  constructor(data) {
    super(data);
    this._register();
    // this._handleData(data);
  }

  async _register() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    console.log('pushtoken', finalStatus);
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log('pushtoken', token);
  }

  _handleData(data) {
    switch (data.type) {
      case 'message':
        break;
      case 'room':
        authStore.tabBadgeCount += 1;
        break;
    }
  }
}
