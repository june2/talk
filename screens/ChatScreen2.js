import React, { Component } from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, View, TouchableHighlight } from 'react-native';
import { Icon, ActionSheet } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat'
import { observer } from 'mobx-react';
import config from '../constants/Config';
import msgService from '../services/messages';
import roomStore from '../stores/RoomStore';
import authStore from '../stores/AuthStore';

@observer
export default class ChatScreen extends Component {
  state = {
    messages: [],
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
