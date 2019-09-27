import { observable, action, computed, configure } from 'mobx';
import reportService from '../services/reports';

class ReportStore {
  constructor() {
    this._report = reportService;
  }

  @action async createReport(to, from, msg, option) {
    try {            
      return await this._report.createReport(to, from, msg, option);
    } catch (err) {
      // Alert.alert('Error', err.message)
    }
  }

}

const store = new ReportStore();

export default store;