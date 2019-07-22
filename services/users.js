import api from '.';

const API_URL = 'http://13.76.166.152:3001';

export const getUsers = () => api(`${API_URL}/users`);

