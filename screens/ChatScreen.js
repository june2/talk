import React, { Component } from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Icon, ActionSheet } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat'
import { observer } from 'mobx-react';
import config from '../constants/Config';
import msgService from './../services/messages';
import roomStore from './../stores/RoomStore';
import authStore from './../stores/AuthStore';

@observer
export default class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chat',
      navigatorStyle: {
        navBarHidden: false,
      },
      headerRight: (
        <Icon name='ios-menu'
          style={{ paddingRight: 10, color: '#e91e63', fontSize: 30, }}
          onPress={() =>
            ActionSheet.show(
              {
                options: [
                  { text: "report", icon: "trash", iconColor: "#fa213b" },
                  { text: "leave", icon: "close", iconColor: "#25de5b" },
                  { text: "cancle", icon: "close", iconColor: "#25de5b" }
                ],
                cancelButtonIndex: 2,
                // destructiveButtonIndex: 4,
                // title: "Testing ActionSheet"
              },
              buttonIndex => {
                switch (buttonIndex) {
                  case 0:
                    break;
                  case 1:                    
                    roomStore.deleteRoomByRoomId(navigation.getParam('roomId'), navigation.getParam('roomIndex'));
                    navigation.navigate('List', {});                    
                    break;
                  default:
                    break;
                }
              }
            )}
        />
      ),
    }
  };

  constructor(props) {
    super(props);
    this._msgService = msgService;
    this.state = {
      roomIndex: this.props.navigation.getParam('roomIndex'),
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
      messages = messages.map((chatMessage) => {
        return {
          _id: chatMessage._id,
          text: chatMessage.text,
          createdAt: chatMessage.createdAt,
          user: {
            _id: chatMessage.user._id,
            name: chatMessage.user.name,
            avatar: chatMessage.user.images.length !== 0 ? config.apiHost + chatMessage.user.images[0].thumbnail : config.defaultUserImg
          }
        };
      });
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
    // call api
    this._msgService.createMessage(this.state.roomId, authStore.me.id, messages[0].text);
    // update local data
    roomStore.updateValue(this.state.roomIndex, messages[0].text);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  componentWillMount() {    
    this._getData();
    this.setState({
      messages: [],
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          Platform.OS === 'android' ?
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={{ flex: 1 }}
            >
              <GiftedChat
                messages={this.state.messages}
                onSend={messages => this._onSend(messages)}
                alwaysShowSend={true}
                textInputProps={{ autoFocus: false, placeholder: '' }}
                user={{
                  _id: authStore.me.id,
                }}
              />
            </KeyboardAvoidingView> :
            <GiftedChat
              messages={this.state.messages}
              onSend={messages => this._onSend(messages)}
              alwaysShowSend={true}
              textInputProps={{ autoFocus: false, placeholder: '' }}
              user={{
                _id: authStore.me.id,
              }}
            />
        }
      </View>
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
