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
  @observable messages = {};

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
      if(this.list.length > 0) this.isEmpty = false;
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
      if(this.list.length === 0) this.isEmpty = true;
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

  @action handlePush(id, msg) {
    let index = 0;
    this.list[index].count += 1;
    this.list[index].lastMsg = msg
  }
}

const store = new RoomStore();

export default store;