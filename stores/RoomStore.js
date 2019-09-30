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
  @observable room = {};
  @observable rooms = {};
  @observable messages = {};

  @action async createRoom(userId, lastMsg) {
    try {
      this.room = await this._room.createRoom(userId, lastMsg);
      return this.room;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async getRooms(limit = 20, offset = 0) {
    try {
      this.rooms = await this._room.getRooms(limit, offset);
      if (offset === 0) {
        this.list = this.rooms.docs;
      } else {
        this.list = this.list.concat(this.rooms.docs);
      }
      return this.rooms;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async getMsgByRoomId(id) {
    try {
      this.messages = await this._room.getMsgByRoomId(id);
      return this.messages;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async deleteRoomByRoomId(id, index) {
    try {
      this._room.deleteRoomByRoomId(id);
      this.list.splice(index, 1);
      return this.list;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action createMessage(id, msg) {
    this._msg.createMessage(this.roomId, id, msg);
    this.updateValue(msg);
  }

  @action updateValue(lastMsg) {
    let obj = this.list[this.roomIndex];
    obj.lastMsg = lastMsg;
    this.list.splice(this.roomIndex, 1);
    this.list = [obj, ...this.list];
  }
}

const store = new RoomStore();

export default store;