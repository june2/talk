import axios from 'axios';
import {
  AsyncStorage,
} from 'react-native';
import config from '../constants/Config'

const domain = config.apiHost;
const api = (entity) => {
  return {
    get: async (resource, params) => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
      try {
        if (!params) params = '';
        else '?' + params;
        let res = await axios.get(`${domain + entity + resource}${params}`);
        return res.data;
      } catch (err) {
        console.log('err', err.response.status);
        throw err.response.data;
      }
    },
    post: async (resource, data) => {
      try {
        let res = await axios.post(`${domain + entity + resource}`, data);        
        return res.data;
      } catch (err) {
        throw err.response.data;
      }
    },
    put: async (resource, params) => {
      try {
        return await axios.put(`${domain + entity + resource}`, params)
      } catch (err) {
        throw err;
      }
    },
    delete: async (resource, params) => {
      try {
        return await axios.delete(`${domain + entity + resource}`)
      } catch (err) {
        throw err;
      }
    },
    upload: async (resource, data) => {
      try {
        let res = await axios({
          method: 'post',
          url: `${domain + entity + resource}`,
          data: data,
          config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
        return res.data;
      } catch (err) {
        throw err.response.data;
      }
    },
  }
}

export default api;