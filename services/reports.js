import api from './index';

class ReportService {
  constructor() {
    this._api = api('report');
  }

  async createReport(to, from, msg, option) {
    try {
      let data = {
        to: to, 
        from: from, 
        msg: msg, 
        option: option
      }
      return await this._api.post('/', data);
    } catch (err) {
      throw err;
    }
  }
}

export default new ReportService();