
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import IconBadge from 'react-native-icon-badge';
import { Text } from 'native-base';
import { observer } from 'mobx-react';

import Colors from '../constants/Colors';
import authStore from './../stores/AuthStore';

@observer
export default class TabBarChatIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <IconBadge
        MainElement={
          <Ionicons
            name={this.props.name}
            size={30}
            style={{ marginBottom: -3 }}
            color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        }
        BadgeElement={
          <Text style={{ color: '#FFFFFF' }}>1</Text>
        }
        Hidden={authStore.tabBadgeCount == 0}
        IconBadgeStyle={{
          left: 17,
          width: 18,
          height: 18,
        }}
      />
    );
  }
}



