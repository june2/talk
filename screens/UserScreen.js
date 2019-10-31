import React, { Component } from 'react';
import {
  Modal,
  View, Alert,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { Textarea, Text, Button, Icon, } from 'native-base';
import { observer } from 'mobx-react';
import userStore from './../stores/UserStore';
import authStore from '../stores/AuthStore';
import roomStore from '../stores/RoomStore';
import { getLocation } from './../constants/Items';
import { getAge } from './../components/Util';
import Carousel from '../components/Carousel';
import Colors from './../constants/Colors'

@observer
export default class UserScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: userStore.user.name,
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
          onPress={() => navigation.goBack()}
        />
      ),
    }
  };

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
    this._setModalVisible(false);
    this.props.navigation.navigate('Chat');
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContainerTransparentStyle}>
              <Textarea rowSpan={5} placeholder="메시지를 보내세요!" style={styles.modalText} onChangeText={(text) => this.setState({ text })} />
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.modalButton}>
                  <Button block title="cancel" onPress={() => this._setModalVisible(false)} >
                    <Text>취소</Text>
                  </Button>
                </View>
                <View style={styles.modalButton}>
                  <Button block title="send" onPress={() => this._sendMsg()} >
                    <Text>보내기</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.containerImgBox}>
          <Carousel images={userStore.user.images} isMe={false} navigation={this.props.navigation} />
        </View>
        <View style={styles.containerTitleBox}>
          <Grid>
            <Col>
              <Text style={styles.containerTitleBoxName}>{userStore.user.name}</Text>
              <Text style={styles.containerTitleBoxLocation}>
                <Icon active name={
                  userStore.user.gender === 'M' ? 'md-female' : 'md-male'
                } style={{
                  ...styles.containerGenderIcon,
                  color: userStore.user.gender === 'M' ? '#007aff' : 'red',
                }} />&nbsp;&nbsp;&nbsp;
                {getAge(userStore.user.birthday)}&nbsp;&nbsp;&nbsp;
                {getLocation(userStore.user.location)}
              </Text>
            </Col>
            {(!userStore.isChat) ?
              <Col style={styles.containerTitleBoxButton}>
                <Button block transparent style={{ height: 55 }} onPress={() => this._setModalVisible(true)}>
                  <Icon active name='ios-chatbubbles' style={styles.containerTitleBoxButtonIcon} />
                </Button>
              </Col> : null}
          </Grid>
        </View>
        <View style={styles.containerTextBox}>
          <Text style={styles.containerText}>
            {userStore.user.intro}
          </Text>
        </View>
      </View >
    );
  }
}


if (Platform.OS === 'android') {
  UserScreen.navigationOptions = {
    // title: 'Chat',
    header: null,
  };
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
    flex: 3,
  },
  containerImgTitle: {
    color: '#fff',
    fontSize: 30,
  },
  containerTitleBox: {
    flexDirection: 'row',
    flex: 0.6,
    backgroundColor: '#fff',
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
  containerGenderIcon: {
    marginLeft: 15,
    fontSize: 12,
  },
  containerTitleBoxButtonIcon: {
    fontSize: 40,
    color: Colors.tintColor,
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
    backgroundColor: '#fff',
    height: '100%'
  },
  containerText: {
    height: '100%',
    marginLeft: 15,
    marginRight: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'rgb(178, 181, 182)',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: Math.round(Dimensions.get('window').height) * 0.2,
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
    top: 10,
    padding: 10,
    width: '100%'
  },
  modalButton: {
    padding: 10,
    width: '50%'
  }
});
