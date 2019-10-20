import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import TabBarChatIcon from '../components/TabBarChatIcon';
import UsersScreen from '../screens/UsersScreen';
import ListScreen from '../screens/ListScreen';
import MyScreen from '../screens/MyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TermScreen from '../screens/TermScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

/**
 * My
 */
const MyStack = createStackNavigator(
  {
    My: MyScreen,
    // MyUpdate: MyUpdateScreen,
  },
  config
);

MyStack.navigationOptions = {
  tabBarLabel: 'My',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

MyStack.path = '';

/**
 * Link
 */
const UsersStack = createStackNavigator(
  {
    Users: UsersScreen,
  },
  config
);

UsersStack.navigationOptions = {
  tabBarLabel: 'Users',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list-box' : 'md-list-box'} />
  ),
};

UsersStack.path = '';

/**
 * List
 */
const ListStack = createStackNavigator(
  {
    List: ListScreen
  },
  config
);

ListStack.navigationOptions = {
  tabBarLabel: 'List',
  tabBarIcon: ({ focused }) => (
    <TabBarChatIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'} />
  ),
};

ListStack.path = '';

/**
 * Setting
 */
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  MyStack,
  UsersStack,
  ListStack,
  SettingsStack
}, {
  tabBarOptions: {
    showLabel: false,
    activeTintColor: '#e91e63',
    iconStyle: {
      // fontSize: 30,
      height: 30, width: 30
    },
    style: {
      // backgroundColor: 'blue',
    },
  }
});

tabNavigator.path = '';

export default tabNavigator;
