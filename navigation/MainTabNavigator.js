import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';
import ListScreen from '../screens/ListScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

/**
 * home
 */
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

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
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'} />
  ),
};

UsersStack.path = '';

/**
 * List
 */
const ListStack = createStackNavigator(
  {
    List: ListScreen,
    Chat: ChatScreen
  },
  config
);

ListStack.navigationOptions = {
  tabBarLabel: 'List',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'} />
  ),
};

ListStack.path = '';

/**
 * Chat
 */
const ChatStack = createStackNavigator(
  {
    Chat: ChatScreen,
  },
  config
);

ChatStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

ChatStack.path = '';

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
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  UsersStack,
  ListStack,
  // ChatStack,
  SettingsStack,
  HomeStack,
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
