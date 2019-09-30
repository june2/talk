import { observable, action, computed, configure } from 'mobx';
import reportService from '../services/reports';
import {
  Alert
} from 'react-native';

class ReportStore {
  constructor() {
    this._report = reportService;
  }

  @action async createReport(from, to, msg, option) {
    try {
      return await this._report.createReport(from, to, msg, option);
    } catch (err) {
      Alert.alert('Error', err);
    }
  }

}

const store = new ReportStore();

export default store;