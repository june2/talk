import { observable, action, computed, configure } from 'mobx';
import roomService from '../services/rooms'

// configure({ enforceActions: 'observed' });

class RoomStore {
  constructor() {
    this._room = roomService;
  }
  @observable room = {};
  @observable rooms = {};

  @action async createRoom(userId, lastMsg) {
    try {
      this.room = await this._room.createRoom(userId, lastMsg);
      return this.room;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

  @action async getRooms() {
    try {
      this.rooms = await this._room.getRooms();
      return this.rooms;
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }
}

const store = new RoomStore();

export default store;