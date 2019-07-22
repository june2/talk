const api = async url => {
  console.log('[request]', url);
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default api;
