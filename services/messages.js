import api from './index';

class RoomService {
  constructor() {
    this._api = api('messages');
  }

  async createMessage(room, user, text, image) {
    try {
      let data = {
        room: room,
        user: user,
      }
      if (image) data.image = image;
      if (text) data.text = text;
      return await this._api.post('/', data);
    } catch (err) {
      throw err;
    }
  }

}

export default new RoomService();