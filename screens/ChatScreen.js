import React, { Component } from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, View, Modal } from 'react-native';
import { Icon, ActionSheet } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat'
import { observer } from 'mobx-react';
import Report from '../components/Report';
import msgService from './../services/messages';
import roomStore from './../stores/RoomStore';
import authStore from './../stores/AuthStore';

@observer
export default class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: roomStore.roomName,
      navigatorStyle: {
        navBarHidden: false,
      },
      headerLeft: (
        <Icon name='md-arrow-round-back'
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: 'rgba(0, 0, 0, .9)',
            marginHorizontal: 16,
            textAlign: 'center',
          }}
          onPress={() => navigation.navigate('List')}
        />
      ),
      headerRight: (
        <Icon name='ios-menu'
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: 'rgba(0, 0, 0, .9)',
            marginHorizontal: 16,
            textAlign: 'center',
          }}
          onPress={() =>
            ActionSheet.show(
              {
                options: [
                  { text: "report" },
                  { text: "leave" },
                  { text: "cancle" }
                ],
                cancelButtonIndex: 2,
                // destructiveButtonIndex: 4,
                // title: "Testing ActionSheet"
              },
              buttonIndex => {
                switch (buttonIndex) {
                  case 0:
                    params.openModal(true);
                    break;
                  case 1:
                    roomStore.deleteRoomByRoomId(roomStore.roomId, roomStore.roomIndex);
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
      roomIndex: roomStore.roomIndex,
      roomId: roomStore.roomId,
      messages: [],
      refreshing: false,
      totalDocs: 0,
      offset: 0,
      limit: 0,
      modalVisible: false,
    }
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  _getData = async () => {
    if (this.state.totalDocs >= this.state.limit * this.state.offset) {
      await roomStore.getMsgByRoomId(this.state.roomId);
      this.setState({
        // offset: res.offset + 1,
        // limit: res.limit,
        // totalDocs: res.totalDocs,
        refreshing: false
      })
    }
  }

  _onSend(messages = []) {
    roomStore.createMessage(authStore.me.id, roomStore.roomUserId, messages[0].text);    
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))  
    roomStore.messages = GiftedChat.append(roomStore.messages, messages);    
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    this._getData();
    roomStore.messages = [];
    this.props.navigation.setParams({ openModal: this.setModalVisible });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
          }}>
          <View style={{ flex: 1 }}>
            <Report closeModal={(visible) => this.setModalVisible(visible)} />
          </View>
        </Modal>
        {
          Platform.OS === 'android' ?
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={{ flex: 1 }}
            >
              <GiftedChat
                messages={roomStore.messages}
                onSend={messages => this._onSend(messages)}
                alwaysShowSend={true}
                textInputProps={{ autoFocus: false, placeholder: '' }}
                user={{
                  _id: authStore.me.id,
                }}
              />
            </KeyboardAvoidingView> :
            <GiftedChat
              messages={roomStore.messages}
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