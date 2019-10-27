import {
  AsyncStorage,
} from 'react-native';
import config from '../constants/Config'

const domain = config.apiHost;

export class DataCall {
  // Just simulating incremental loading, don't infer anything from here
  static async get(entity, resource, start, count) {
    const url = `${domain + entity + resource}`;
    console.log(url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
      }
    })
    const data = await response.json();    
    return data;
  }
}
