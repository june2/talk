import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Textarea, Text, Button, } from 'native-base';
import { observer } from 'mobx-react';
import authStore from '../stores/AuthStore';
import roomStore from '../stores/RoomStore';
import userStore from '../stores/UserStore';
import Colors from '../constants/Colors';

@observer
export default class MessageBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  _sendMsg = async () => {
    if (!authStore.me.point || authStore.me.point < 50) {
      return Alert.alert('포인트가 부족합니다.');
    }
    if (this.state.text.length < 5) {
      return Alert.alert('5자 이상으로 작성해주세요!');
    }
    // 차감
    authStore.me.point -= 50;
    this.setState({ isSent: true });
    let room = await roomStore.createRoom(userStore.user._id, this.state.text);
    await roomStore.getRooms();
    roomStore.setValue(room.id, 0, userStore.user.name, userStore.user._id);
    userStore.setMsgBox(false);
    this.props.navigation.navigate('Chat');
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={userStore.isMsgVisible}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => userStore.setMsgBox(false)}
        >
          <View style={styles.container}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContainerTransparentStyle}>
                <Textarea
                  autoFocus rowSpan={5}
                  placeholder="인상 깊은 첫인삿말을 보내보세요! &#13;&#10;* 50포인트가 차감됩니다. &#13;&#10;* 5자 이상 작성해주세요. " maxLength={200}
                  style={styles.modalText}
                  onChangeText={(text) => this.setState({ text })} />
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.modalButtonBox}>
                    <Button style={styles.modalButton} block title="cancel" onPress={() => userStore.setMsgBox(false)} >
                      <Text>취소</Text>
                    </Button>
                  </View>
                  <View style={styles.modalButtonBox}>
                    <Button style={styles.modalButton} block title="send" onPress={() => this._sendMsg()} >
                      <Text>보내기</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

      </Modal >
    );
  }
}

const height = Math.round(Dimensions.get('window').height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: height * 0.2,
  },
  modalContainerTransparentStyle: {
    backgroundColor: '#fff',
    width: '80%'
  },
  modalView: {
    flex: 1,
    marginTop: 30,
    marginBottom: 30,
    justifyContent: 'center',
  },
  modalText: {
    top: 10,
    padding: 10,
    width: '100%'
  },
  modalButtonBox: {
    padding: 10,
    width: '50%',
  },
  modalButton: {
    backgroundColor: Colors.tintColor
  }
});
