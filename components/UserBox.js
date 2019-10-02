import React, { Component } from 'react';
import {
  Modal, TouchableHighlight,
  View, Alert,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {
  FlingGestureHandler,
  Directions,
} from 'react-native-gesture-handler';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Textarea, Text, Button, Icon, } from 'native-base';
import { observer } from 'mobx-react';
import Slideshow from 'react-native-image-slider-show';
import userStore from './../stores/UserStore';
import authStore from '../stores/AuthStore';
import { getAge } from './../components/Util';

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
    if (!authStore.me.point || authStore.me.point < 50) {
      return Alert.alert('포인트가 부족합니다.');
    }
    if (this.state.text.length < 5) {
      return Alert.alert('5자 이상으로 작성해주세요!');
    }
    // 차감
    authStore.me.point -= 50;
    this.setState({ isSent: true });
    this.props.sendMsg(this.state.text);
    this._setModalVisible(false);
  }

  render() {
    return (
      <FlingGestureHandler
        direction={Directions.DOWN}
        numberOfPointers={1}
        onHandlerStateChange={() => this.props.closeModal(false)}>
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
                    <Button block title="send" onPress={() => this._sendMsg()} >
                      <Text>보내기</Text>
                    </Button>
                  </Col>
                  <Col style={styles.modalButton}>
                    <Button block title="cancel" onPress={() => this._setModalVisible(false)} >
                      <Text>취소</Text>
                    </Button>
                  </Col>
                </Grid>
              </View>
            </View>
          </Modal>
          <View style={styles.containerImgBox}>
            <Slideshow
              height={this.state.screenHeight / 1.5}
              titleStyle={styles.containerImgTitle}
              containerStyle={styles.containerImg}
              dataSource={userStore.slider} />
            <TouchableHighlight onPress={() => this.props.closeModal(false)} style={styles.containerCloseBox}>
              <Icon active name='ios-close' style={styles.containerCloseBoxButton} />
            </TouchableHighlight>
          </View>
          <View style={styles.containerTitleBox}>
            <Grid>
              <Col>
                <Text style={styles.containerTitleBoxName}>{userStore.user.name}</Text>
                <Text style={styles.containerTitleBoxLocation}>
                  {getAge(userStore.user.birthday)}   {userStore.user.location}
                </Text>
              </Col>
              <Col style={styles.containerTitleBoxButton}>
                <Button block transparent style={{ height: 55 }} onPress={() => this._setModalVisible(true)}>
                  <Icon active name='ios-chatboxes' style={styles.containerTitleBoxButtonIcon} />
                </Button>
              </Col>
            </Grid>
          </View>
          <View style={styles.containerTextBox}>
            <Text style={styles.containerText}>
              {userStore.user.intro}
            </Text>
          </View>
          {/* <View style={styles.containerButtonBox}>
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
          </View> */}
        </View>
      </FlingGestureHandler>
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
    flex: 3.5,
  },
  containerImg: {
    flex: 1,
    width: '100%',
  },
  containerImgTitle: {
    color: '#fff',
    fontSize: 30,
  },
  containerTitleBox: {
    flexDirection: 'row',
    flex: 0.5,
  },
  containerTitleBoxName: {
    marginTop: 15,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 25
  },
  containerTitleBoxLocation: {
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'rgb(178, 181, 182)'
  },
  containerTitleBoxButton: {
    marginTop: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  containerTitleBoxButtonIcon: {
    fontSize: 40,
    color: '#007aff',
  },
  containerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerIcon: {
    fontSize: 40,
    color: 'red',
  },
  containerTextBox: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  containerText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'rgb(178, 181, 182)',
  },  
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: Math.round(Dimensions.get('window').height) * 0.3,
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
