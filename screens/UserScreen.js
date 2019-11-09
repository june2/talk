import React, { Component } from 'react';
import {
  Modal,
  View,
  ScrollView,
  Alert,
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
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.modalVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContainerTransparentStyle}>
                <Textarea autoFocus rowSpan={5} placeholder="인상 깊은 첫인삿말을 보내보세요! &#13;&#10;* 50포인트가 차감됩니다. &#13;&#10;* 5자 이상 작성해주세요. " maxLength={200} style={styles.modalText} onChangeText={(text) => this.setState({ text })} />
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.modalButtonBox}>
                    <Button style={styles.modalButton} block title="cancel" onPress={() => this._setModalVisible(false)} >
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
          </Modal>
          <View style={styles.containerImgBox}>
            <Carousel images={userStore.user.images} isMe={false} navigation={this.props.navigation} />
          </View>
          <View style={styles.containerTitleBox}>
            <Grid>
              <Col style={styles.containerTitle}>
                <Text style={styles.containerTitleBoxName} numberOfLines={1} ellipsizeMode='tail'>
                  {userStore.user.name}
                </Text>
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
                  <Button rounded style={styles.containerButton} onPress={() => this._setModalVisible(true)}>
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
      </ScrollView>
    );
  }
}


if (Platform.OS === 'android') {
  UserScreen.navigationOptions = {
    title: 'Chat',
    header: null,
  };
}

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height + 50
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
    // flex: 2,
    height: height * 0.7
  },
  containerImgTitle: {
    color: '#fff',
    fontSize: 30,
  },
  containerTitleBox: {
    flexDirection: 'row',
    height: 70,
  },
  containerTitle: {
    paddingTop: 3
  },
  containerTitleBoxName: {
    width: width - 90,
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
    marginTop: 3,
    marginRight: 10,
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  containerGenderIcon: {
    marginLeft: 15,
    fontSize: 12,
  },
  containerTitleBoxButtonIcon: {
    fontSize: 35,
    color: Colors.tintColor,
  },
  containerButton: {
    height: 60,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOpacity: 0.6,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
  },
  containerIcon: {
    fontSize: 40,
    color: 'red',
  },
  containerTextBox: {
    marginLeft: 15,
    marginRight: 15,
  },
  containerText: {
    paddingTop: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'rgb(178, 181, 182)',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.2,
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
    // borderWidth: 1,
    // borderColor: 'red',    
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
