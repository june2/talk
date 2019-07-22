import axios from 'axios';

const domain = 'http://13.76.166.152:3001/';
const api = (entity) => {
  return {
    get: async (resource, params) => {
      try {
        if (!params) params = '';
        else '?' + params;
        let res = await axios.get(`${domain + entity + resource}${params}`);
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    post: async (resource, data) => {
      try {
        let res = await axios.post(`${domain + entity + resource}`, data)
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
  }
}

export default api;