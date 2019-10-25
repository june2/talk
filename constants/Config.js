export default {
  apiHost: 'https://api.talknock.com/',
  // apiHost: 'http://54.180.105.130/',  
  // apiHost: 'http://127.0.0.1:3001/',
  adUnitID: 'pub-7185868759159346',
  deviceID: 'EMULATOR',
  defaultUserImg: (gender) =>
    gender === 'M' ? require('./../assets/images/m.png') : require('./../assets/images/f.png'),
};
