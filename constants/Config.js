import { Platform } from "react-native";

export default {
  apiHost: 'https://api.talknock.com/',
  // apiHost: 'http://10.95.184.49:3001/',  
  // apiHost: 'http://127.0.0.1:3001/',
  unitId: Platform.OS === 'ios'
    ? 'ca-app-pub-7185868759159346/8002158039'
    : 'ca-app-pub-7185868759159346/3352053895',
  deviceID: 'EMULATOR',
  defaultUserImg: (gender) =>
    gender === 'M' ? require('./../assets/images/m.png') : require('./../assets/images/f.png'),
};
