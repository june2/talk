import React, { Component } from 'react';
import {
  FlatList,
  Modal, TouchableHighlight, View, Alert
} from 'react-native';
import {
  ListItem, Left, Body, Right,
  Thumbnail, Text
} from 'native-base';
import { observer } from 'mobx-react';
import userStore from './../stores/UserStore';

@observer
export default class UserBox extends Component {
  constructor(props) {
    super(props);    
  }

  render() {
    return (
      <View>
        <Text>Hello World!!!!!!</Text>

        <TouchableHighlight
          onPress={() => this.props.closeModal(false)}>
          <Text>Hide Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}