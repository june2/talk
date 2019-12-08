import React, { Component } from 'react';
import { AppState, Platform, View, Alert, PermissionsAndroid } from 'react-native';
import { Icon, ActionSheet } from 'native-base';
import { GiftedChat, Send } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import ReportBox from '../components/ReportBox';
import msgService from './../services/messages';
import roomStore from './../stores/RoomStore';
import userStore from './../stores/UserStore';
import authStore from './../stores/AuthStore';
import Colors from './../constants/Colors'

@observer
export default class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => {
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
                  { text: "차단하기" },
                  { text: "나가기" },
                  { text: "취소" }
                ],
                cancelButtonIndex: 3,
              },
              buttonIndex => {
                switch (buttonIndex) {
                  case 0:
                    userStore.setReportBox(true);
                    break;
                  case 1:
                    roomStore.deleteRoomByRoomId(roomStore.roomId, roomStore.roomIndex);
                    navigation.navigate('List', {});
                    break;
                  case 2:
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
      appState: AppState.currentState,
      roomIndex: roomStore.roomIndex,
      roomId: roomStore.roomId,
      refreshing: false,
      totalDocs: 0,
      offset: 0,
      limit: 0,
      messages: [],
    }
  }

  _handleRefresh = () => {
    this._getData();
    roomStore.messages = [];
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
    roomStore.messages = GiftedChat.append(roomStore.prevMessages, messages);
  }

  _onSendImg = async (uri) => {
    let date = new Date();
    let newVal = [{
      _id: date.getTime(),
      createdAt: date,
      image: uri,
      user: { _id: authStore.me.id },
    }]
    roomStore.messages = GiftedChat.append(roomStore.prevMessages, newVal);
    let image = await authStore.sendImage(uri);
    roomStore.createImage(authStore.me.id, roomStore.roomUserId, '사진...', image);
  }

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  _getPermissionAsync = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('사진 사용을 허용해주세요!');
      }
    } else {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('사진 사용을 허용해주세요!');
      }
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/active/) && nextAppState === 'active') {
      this._handleRefresh();
    }
  }

  componentDidMount() {
    this._getPermissionAsync();
    this._handleRefresh();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    roomStore.roomId = null;
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ReportBox />
        <View style={{ flex: 1 }}>
          <GiftedChat
            messages={roomStore.messages}
            onSend={messages => this._onSend(messages)}
            textInputProps={{ autoFocus: false, placeholder: '' }}
            user={{ _id: authStore.me.id }}
            alwaysShowSend={true}
            maxInputLength={200}
            onPressAvatar={(user) => { this.props.navigation.navigate('User'); }}
            renderActions={(props) =>
              <Send {...props}>
                <View style={{ marginLeft: 14, marginBottom: 5 }}>
                  <Icon name='md-images' style={{ color: Colors.tintColor }} onPress={() => this._pickImage()} />
                </View>
              </Send>}
            renderSend={(props) =>
              <Send {...props}>
                <View style={{ marginRight: 10, marginBottom: 5 }}>
                  <Icon name='md-send' style={{ color: Colors.tintColor }} />
                </View>
              </Send>}
          />
          {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
        </View>
      </View>
    )
  }
}
