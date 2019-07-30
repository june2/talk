import api from './index';

class RoomService {
  constructor() {
    this._api = api('rooms');
  }

  async createRoom(userId, lastMsg) {
    try {
      let data = {
        userId: userId,
        lastMsg: lastMsg
      }
      return await this._api.post('/', data);
    } catch (err) {
      throw err;
    }
  }

  async getRooms() {
    try {
      return await this._api.get('/');
    } catch (err) {
      throw err;
    }
  }

  async getMsgByRoomId(id) {
    try {
      return await this._api.get(`/${id}/messages`);
    } catch (err) {
      throw err;
    }
  }  
}

export default new RoomService();