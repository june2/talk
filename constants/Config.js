export default {
  apiHost: 'http://54.180.105.130/',
  // apiHost: 'http://172.30.1.48:3001/',
  // apiHost: 'http://192.168.0.2:3001/',
  // apiHost: 'http://127.0.0.1:3001/',
  defaultUserImg: (gender) =>
    gender === 'M' ? require('./../assets/images/m.png') : require('./../assets/images/f.png'),
  adUnitID: 'ca-app-pub-3940256099942544/6300978111',
  deviceID: 'EMULATOR'
};
