import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import { observer } from 'mobx-react';
import State from './../components/AppState';
import authStore from './../stores/AuthStore';

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
    console.log(userToken);
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userToken && user) {
      authStore.token = userToken;
      authStore.updateLastLogin();
      this.props.navigation.navigate('Main');
    } else {
      // this.props.navigation.navigate('Auth');
      this.props.navigation.navigate('Register');      
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
        <State />
      </View>
    );
  }
}