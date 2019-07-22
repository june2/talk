import React from 'react';
import {
  AsyncStorage,
  Button,
  View,
} from 'react-native';
import { login } from './../services/auth'

export default class LoginScreen extends React.Component {

  _signInAsync = async () => {
    let res = await login();
    console.log(res);
    // await AsyncStorage.setItem('userToken', 'abc');
    // this.props.navigation.navigate('Main');
  }

  render() {
    return (
      <View>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }  
}

LoginScreen.navigationOptions = {
  title: 'Login',
};
