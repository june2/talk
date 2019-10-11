import { Component } from 'react';
import { observer } from 'mobx-react';
import authStore from '../stores/AuthStore';
import roomStore from '../stores/RoomStore';
import notificationStore from '../stores/NotificationStore';

@observer
export default class Handler extends Component {
  constructor(data) {
    super(data);
    this._handleData(data);
  }

  _handleData(data) {
    switch (data.type) {
      case 'msg':
        let msgObj = {
          _id: 0,
          text: data.msg,
          createdAt: new Date(),
          user: {
            _id: data.userId,
            name: data.userName,
            avatar: data.userImage,
          }
        };
        roomStore.handlePushMsg(msgObj);
        break;
      case 'room':       
        authStore.tabBadgeCount += 1;
        break;
    }
    // alert   
    let roomObj = {
      _id: data.roomId,
      lastMsg: data.msg,
      user: {
        id: data.userId,
        name: data.userName,
        images: [data.userImage],
      },
      updatedAt: new Date(),
      count: 1,
    }
    roomStore.handlePush(data.roomId, data.msg, roomObj);
    notificationStore.show();
  }
}
