import React, { Component } from 'react';
import { AppState, Text } from 'react-native';
import { observer } from 'mobx-react';
import authStore from '../stores/AuthStore';

@observer
export default class State extends Component {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    this._update();
    setInterval(() => {
      this._update();
    }, 1000 * 60 * 10);
  }
  _update = () => {
    authStore.updateLastLogin();
  }
  
  render() {
    return null;
  }
}