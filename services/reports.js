import api from './index';

class ReportService {
  constructor() {
    this._api = api('reports');
  }

  async createReport(from, to, msg, option) {
    try {
      let data = {
        from: from,
        to: to,
        msg: msg,
        option: option
      }
      return await this._api.post('', data);
    } catch (err) {
      throw err;
    }
  }
}

export default new ReportService();