import React from 'react';
import {
  AsyncStorage,
  StatusBar,
  View,
  Alert,
} from 'react-native';
import {
  Spinner,
} from 'native-base';
import { observer } from 'mobx-react';
import * as Permissions from 'expo-permissions';
import State from './../components/AppState';
import authStore from './../stores/AuthStore';
import roomStore from './../stores/RoomStore';
import Colors from './../constants/Colors'

@observer
export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('token');
    const user = await authStore.getMe();
    // console.log(userToken);
    this._checkNotification();
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userToken && user) {
      authStore.token = userToken;
      await roomStore.getRooms(1);
      let res = await authStore.updateLastLogin();
      // this._checkLogin(res.data);
      this.props.navigation.navigate('Users');
    } else {
      // this.props.navigation.navigate('Auth');
      this.props.navigation.navigate('Register');
    }
  };

  _checkLogin(data) {
    if (data.reward) this._showAlert();
    authStore.updatePoint(data.point);
  }

  _showAlert = () => {
    Alert.alert(
      '출석 체크',
      '출석 보상금으로 포인트가 충전됬습니다.',
      [
        {
          text: '확인',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  _checkNotification = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (finalStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <Spinner color={Colors.spinner} />
        <StatusBar barStyle="default" />
        <State />
      </View>
    );
  }
}