import { Component } from 'react';
import { observer } from 'mobx-react';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import authStore from '../stores/AuthStore';

@observer
export default class Handler extends Component {
  constructor(data) {
    super(data);    
    this._handleData(data);
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
