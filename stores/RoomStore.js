import { observable, action, computed, configure } from 'mobx';
import roomService from '../services/rooms';
import msgService from '../services/messages';

class RoomStore {
  constructor() {
    this._room = roomService;
    this._msg = msgService;
  }

  @observable roomId = null;
  @observable roomIndex = null;
  @observable roomName = null;
  @observable roomUserId = null;
  @observable list = [];
  @observable isEmpty = true;
  @observable room = {};
  @observable rooms = {};
  //TODO: unsolved warning 
  // @observable messages = {};
  @observable messages = [];

  @action async createRoom(userId, lastMsg) {
    try {
      this.room = await this._room.createRoom(userId, lastMsg);
      return this.room;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async getRooms(limit = 20, page = 1) {
    try {
      this.rooms = await this._room.getRooms(limit, page);
      if (page === 1) {
        this.list = this.rooms.docs;
      } else {
        this.list = this.list.concat(this.rooms.docs);
      }
      if (this.list.length > 0) this.isEmpty = false;
      return this.rooms;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async getMsgByRoomId(id) {
    try {
      let res = await this._room.getMsgByRoomId(id);
      if (res.docs) {
        this.messages = res.docs;
        this.messages = this.messages.map((chatMessage) => {
          return {
            _id: chatMessage._id,
            text: chatMessage.text,
            createdAt: chatMessage.createdAt,
            system: chatMessage.system,
            user: {
              _id: chatMessage.user._id,
              name: chatMessage.user.name,
              avatar: chatMessage.user.images.length !== 0 ? chatMessage.user.images[0] : config.defaultUserImg
            }
          };
        });
      }
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async deleteRoomByRoomId(id, index) {
    try {
      this._room.deleteRoomByRoomId(id);
      this.list.splice(index, 1);
      if (this.list.length === 0) this.isEmpty = true;
      return this.list;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action createMessage(from, to, msg) {
    this._msg.createMessage(this.roomId, from, to, msg);
    this.updateValue(msg);
  }

  @action updateValue(lastMsg) {
    let obj = this.list[this.roomIndex];
    obj.lastMsg = lastMsg;
    obj.updatedAt = new Date();
    this.list.splice(this.roomIndex, 1);
    this.list = [obj, ...this.list];
  }

  @action setValue(id, index, name, userId, count) {
    this.roomId = id;
    this.roomIndex = index;
    this.roomName = name;
    this.roomUserId = userId;
    if (count) this.list[this.roomIndex].count -= count;
  }

  @action handlePush(roomId, msg, newVal) {
    let roomIndex = this._findIndex(roomId);    
    if (roomIndex != -1) {
      let obj = this.list[roomIndex];      
      obj.count += 1;
      obj.lastMsg = msg;
      obj.updatedAt = new Date();
      this.list.splice(this.roomIndex, 1);
      this.list = [obj, ...this.list];
    } else {
      let obj = newVal;
      this.list = [obj, ...this.list];
    }
  }

  @action handlePushMsg(newVal) {
    this.messages = [newVal].concat(this.messages);
  }

  _findIndex(id) {
    return this.list.findIndex(el => el._id === id);
  }
}

const store = new RoomStore();

export default store;