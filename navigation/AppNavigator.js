import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen';
import MyUpdateScreen from '../screens/MyUpdateScreen';
import UserScreen from '../screens/UserScreen';
import TermScreen from '../screens/TermScreen';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: createStackNavigator({ SignIn: LoginScreen }),
      Register: createStackNavigator({ Register: RegisterScreen }),
      Chat: createStackNavigator({
        Main: {
          screen: MainTabNavigator,
          navigationOptions: {
            header: null,
          },
        },
        Chat: ChatScreen,
        MyUpdate: MyUpdateScreen,
        User: UserScreen,
        Term: TermScreen,
      })
    },
    {
      initialRouteName: 'AuthLoading',
    })
);