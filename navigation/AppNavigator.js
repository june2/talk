import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatScreen2 from '../screens/ChatScreen2';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: createStackNavigator({ SignIn: LoginScreen }),
      Register: createStackNavigator({ Register: RegisterScreen }),
      Chat: createStackNavigator({ Chat: ChatScreen }),
      Chat2: createStackNavigator({ Chat2: ChatScreen2 }),
      Main: MainTabNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    })
);