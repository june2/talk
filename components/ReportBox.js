import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Textarea, Text, Button } from 'native-base';
import { observer } from 'mobx-react';
import authStore from '../stores/AuthStore';
import userStore from '../stores/UserStore';
import reportStore from '../stores/ReportStore';
import Colors from '../constants/Colors'
import { window } from '../constants/Layout';

@observer
export default class ReportBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      screenHeight: window.height
    }
  }

  _report() {
    if (this.state.text.length < 5) {
      return Alert.alert('10자 이상으로 작성해주세요!');
    }
    reportStore.createReport(authStore.me.id, userStore.user.id, this.state.text);
    userStore.setReportBox(false);
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={userStore.isReportVisible}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => userStore.setReportBox(false)}>
          <View style={styles.container}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContainerTransparentStyle}>
                <Textarea autoFocus rowSpan={5}
                  placeholder="신고 사유를 작성해주세요!"
                  style={styles.modalText}
                  onChangeText={(text) => this.setState({ text })} />
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.modalButtonBox}>
                    <Button style={styles.modalButton} block title="cancel" onPress={() => userStore.setReportBox(false)} >
                      <Text>취소</Text>
                    </Button>
                  </View>
                  <View style={styles.modalButtonBox}>
                    <Button style={styles.modalButton} block title="report" onPress={() => this._report()} >
                      <Text>신고하기</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

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
    paddingTop: window.height * 0.2,
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
