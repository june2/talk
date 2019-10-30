import React, { Component } from 'react';
import { Platform, KeyboardAvoidingView, View, Modal, Alert, } from 'react-native';
import { Icon, ActionSheet } from 'native-base';
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';
import Report from '../components/Report';
import msgService from './../services/messages';
import roomStore from './../stores/RoomStore';
import authStore from './../stores/AuthStore';
import Colors from './../constants/Colors'

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
                  { text: "신고하기" },
                  { text: "나가기" },
                  { text: "취소" }
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
    roomStore.messages = GiftedChat.append(roomStore.messages, messages);
  }

  _onSendImg = async (uri) => {
    let date = new Date();
    let newVal = [{
      _id: date.getTime(),
      createdAt: date,
      image: uri,
      user: { _id: authStore.me.id },
    }]
    roomStore.messages = GiftedChat.append(roomStore.messages, newVal);
    let image = await authStore.sendImage(uri);
    roomStore.createImage(authStore.me.id, roomStore.roomUserId, '사진...', image);
  }

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 4],
      });
      if (!result.cancelled) {
        this._onSendImg(result.uri);
      }
    } catch (err) {
      Alert.alert('서버 에러입니다.');
    }
  };

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
            <View style={{ flex: 1 }}>
              <GiftedChat
                messages={roomStore.messages}
                onSend={messages => this._onSend(messages)}
                alwaysShowSend={true}
                textInputProps={{ autoFocus: false, placeholder: '' }}
                user={{ _id: authStore.me.id }}
              />
              <KeyboardAvoidingView />
            </View>
            :
            <GiftedChat
              messages={roomStore.messages}
              onSend={messages => this._onSend(messages)}
              textInputProps={{ autoFocus: false, placeholder: '' }}
              user={{ _id: authStore.me.id }}
              alwaysShowSend={true}
              renderActions={(props) => <Send
                {...props}
              >
                <View style={{ marginLeft: 14, marginBottom: 5 }}>
                  <Icon name='md-images' style={{ color: Colors.tintColor }} onPress={() => this._pickImage()} />
                </View>
              </Send>}
              renderSend={(props) => <Send
                {...props}
              >
                <View style={{ marginRight: 10, marginBottom: 5 }}>
                  <Icon name='md-send' style={{ color: Colors.tintColor }} />
                </View>
              </Send>}
            />
        }
      </View>
    )
  }
}