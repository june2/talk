import React, { Component } from 'react';
// import { AppState } from 'react-native';
import { observer } from 'mobx-react';
import authStore from '../stores/AuthStore';

@observer
export default class State extends Component {
  // state = {
  //   appState: AppState.currentState,
  // };
  
  _update = () => {
    authStore.updateLastLogin();
  }
  
  render() {
    return null;
  }
}