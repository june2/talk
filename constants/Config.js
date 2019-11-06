export default {
  apiHost: 'https://api.talknock.com/',
  // apiHost: 'http://10.95.184.49:3001/',  
  // apiHost: 'http://127.0.0.1:3001/',
  adUnitID: 'ca-app-pub-7185868759159346/4880757980',
  deviceID: 'EMULATOR',
  defaultUserImg: (gender) =>
    gender === 'M' ? require('./../assets/images/m.png') : require('./../assets/images/f.png'),
};
