import React, { Component } from "react";
import { AppState, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Root } from "native-base";
import { observer } from 'mobx-react';
import firebase from 'react-native-firebase';
import AppNavigator from './../navigation/AppNavigator';
import NotificationHandler from './../notification/handler'
import authStore from './../stores/AuthStore';

@observer
export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    }
    this._initFCM();
  }

  _initFCM() {
    firebase.messaging().hasPermission().then(enabled => {
      if (enabled) {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
          new NotificationHandler(notification._data);
        })
      }
    })
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/active/) && nextAppState === 'active') {
      authStore.getMe();
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return (
      <Root>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
