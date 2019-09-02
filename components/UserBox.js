import React, { Component } from 'react';
import {
  Modal, TouchableHighlight,
  View, Alert,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Textarea, Text, Button, Icon, } from 'native-base';
import { observer } from 'mobx-react';
import { Constants } from 'expo';
import Slideshow from 'react-native-image-slider-show';
import userStore from './../stores/UserStore';

@observer
export default class UserBox extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      modalVisible: false,
      text: '',
      isSent: false,
      screenHeight: Math.round(Dimensions.get('window').height)
    }
  }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _sendMsg() {
    this.setState({ isSent: true });
    this.props.sendMsg(this.state.text);
    this._setModalVisible(false);
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            if (this.state.isSent) this.props.closeModal(false);
          }}
          onDismiss={() => {
            if (this.state.isSent) this.props.closeModal(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContainerTransparentStyle}>
              <Textarea rowSpan={5} placeholder="메시지를 보내세요!" style={styles.modalButton} onChangeText={(text) => this.setState({ text })} />
              <Grid>
                <Col style={styles.modalButton}>
                  <Button block title="Login" onPress={() => this._sendMsg()} >
                    <Text>보내기</Text>
                  </Button>
                </Col>
                <Col style={styles.modalButton}>
                  <Button block title="Login" onPress={() => this._setModalVisible(false)} >
                    <Text>취소</Text>
                  </Button>
                </Col>
              </Grid>
            </View>
          </View>
        </Modal>
        <View style={styles.containerImgBox}>
          <Slideshow
            height={this.state.screenHeight / 2}
            titleStyle={styles.containerImgTitle}
            containerStyle={styles.containerImg}
            dataSource={userStore.slider} />
          <TouchableHighlight onPress={() => this.props.closeModal(false)} style={styles.containerCloseBox}>
            <Icon active name='ios-close' style={styles.containerCloseBoxButton} />
          </TouchableHighlight>
        </View>
        <View style={styles.containerButtonBox}>
          <View style={styles.containerButton}>
            <Button block transparent style={styles.containerButton}>
              <Icon active name='ios-heart' style={styles.containerIcon} />
            </Button>
          </View>
          <View style={styles.containerButton}>
            <Button block transparent style={styles.containerButton} onPress={() => this._setModalVisible(true)}>
              <Icon active name='ios-chatboxes' style={styles.containerIcon} />
            </Button>
          </View>
          <View style={styles.containerButton}>
            <Button block transparent style={styles.containerButton}>
              <Icon active name='md-information' style={styles.containerIcon} />
            </Button>
          </View>
        </View>
        <View style={styles.containerTextBox}>
          <Text style={styles.containerTextTitle}>ABOUT ME</Text>
          <Text style={styles.containerText}>
            {userStore.user.intro}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCloseBox: {
    right: 30,
    top: 50,
    position: 'absolute',
  },
  containerCloseBoxButton: {
    color: '#fff',
    fontSize: 30,
  },
  containerImgBox: {
    flex: 1.5,
  },
  containerImg: {
    flex: 1,
    width: '100%',
  },
  containerImgTitle: {
    color: '#fff',
    fontSize: 30,
  },
  containerButtonBox: {
    flexDirection: 'row',
    flex: 0.5,
  },
  containerButton: {
    flex: 1,
  },
  containerIcon: {
    fontSize: 40,
    color: 'red',
  },
  containerTextBox: {
    flex: 1,
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 12,
    marginLeft: 20,
    marginRight: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  containerTextTitle: {
    top: 10,
    padding: 18,
    flex: 0,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 25,
    color: '#000',
    alignItems: 'center',
  },
  containerText: {
    padding: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 15,
    lineHeight: 25,
    color: '#444444',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 28,
  },
  modalButton: {
    padding: 10,
  }
});
