import { Component } from 'react';
import { observer } from 'mobx-react';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import authStore from '../stores/AuthStore';
import roomStore from '../stores/RoomStore';

@observer
export default class Handler extends Component {
  constructor(data) {
    super(data);
    this._handleData(data);
  }

  _handleData(data) {
    console.log(data);
    roomStore.messages.docs.push({
      _id: 1,
      text: 'test',
      createdAt: new Date(),
    })
    switch (data.type) {
      case 'message':
        break;
      case 'room':
        roomStore.handlePush(1, 'test');
        authStore.tabBadgeCount += 1;
        break;
    }
  }
}
