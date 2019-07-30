import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { observer } from 'mobx-react';
import msgService from './../services/messages';
import roomStore from './../stores/RoomStore';
import authStore from './../stores/AuthStore';

@observer
export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this._msgService = msgService;
    this.state = {
      roomId: this.props.navigation.getParam('roomId'),
      messages: [],
      refreshing: false,
      totalDocs: 0,
      offset: 0,
      limit: 0
    }
  }

  _getData = async () => {
    if (this.state.totalDocs >= this.state.limit * this.state.offset) {
      let res = await roomStore.getMsgByRoomId(this.state.roomId);
      let messages = res.docs;
      this.setState({
        messages: this.state.refreshing ? messages : this.state.messages.concat(messages),
        offset: res.offset + 1,
        limit: res.limit,
        totalDocs: res.totalDocs,
        refreshing: false
      })
    }
  }

  _onSend(messages = []) {
    this._msgService.createMessage(this.state.roomId, authStore.me.id, messages[0].text);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  componentWillMount() {
    this._getData();
    this.setState({
      messages: [
        // {
        //   _id: 1,
        //   text: 'Hello developer',
        //   createdAt: new Date(),
        //   user: {
        //     _id: 2,
        //     name: 'React Native',
        //     avatar: 'https://placeimg.com/140/140/any',
        //   },
        // },
        // {
        //   _id: 2,
        //   text: 'Hello developer !!',
        //   createdAt: new Date(),
        //   user: {
        //     _id: 2,
        //     name: 'React Native',
        //     avatar: 'https://placeimg.com/140/140/any',
        //   },
        //   image: 'https://placeimg.com/140/140/any',
        // },
        // {
        //   _id: 3,
        //   text: 'This is a system message !!!',
        //   createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        //   system: true
        //   // Any additional custom parameters are passed through
        // },
        // {
        //   _id: 4,
        //   text: 'This is my message',
        //   createdAt: new Date(),
        //   user: {
        //     _id: 1,
        //     name: 'React Native'
        //   },
        // }
      ],
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          Platform.OS === 'android' ?
            <KeyboardAvoidingView behavior="padding">
              <GiftedChat
                messages={this.state.messages}
                onSend={messages => this._onSend(messages)}
                user={{
                  _id: authStore.me.id,
                }}
              />
            </KeyboardAvoidingView> :
            <GiftedChat
              messages={this.state.messages}
              onSend={messages => this._onSend(messages)}
              user={{
                _id: authStore.me.id,
              }}
            />
        }
      </View>
    )
  }
}

ChatScreen.navigationOptions = {
  title: 'List',
  navigatorStyle: {
    navBarHidden: false,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
