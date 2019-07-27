import React from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'

export default class ChatScreen extends React.Component {
  state = {
    messages: [],
  }

  _pop() {
    this.props.navigator.pop({
      animated: true, // does the pop have transition animation or does it happen immediately (optional)
      animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
    });
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
        {
          _id: 2,
          text: 'Hello developer !!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
          image: 'https://placeimg.com/140/140/any',
        },
        {
          _id: 3,
          text: 'This is a system message !!!',
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
          system: true
          // Any additional custom parameters are passed through
        },
        {
          _id: 4,
          text: 'This is my message',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'React Native'
          },
        }
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
