import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator,
  Button, Text, Icon, Right, Body, Switch
} from 'native-base';
import {
  Platform,
  AsyncStorage,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { observer } from 'mobx-react';
import Admob from '../components/Admob';
import Notification from '../components/Notification';
import userService from './../services/users';
import authStore from './../stores/AuthStore';
import Colors from '../constants/Colors';
const app = require('./../app.json');

@observer
export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this._user = userService;
  }

  _change = (evt) => {
    authStore.me.isActivePush = evt;
    let data = {
      isActivePush: evt
    }
    authStore.updateMe(data);
  }

  _showAlert = () => {
    Alert.alert(
      '계정 삭제',
      '계정 삭제시, 복원이 되지 않습니다. 정말로 삭제 하시겠습니까?',
      [
        { text: '취소', style: 'cancel', },
        { text: '확인', onPress: () => this._logOut() },
      ],
      { cancelable: false },
    );
  }

  _logOut = async () => {
    // 게정 탈퇴
    authStore.leave();
    await AsyncStorage.clear();
    this.props.navigation.navigate('Register');
  }

  componentDidMount() {
    authStore.reqAdMobReward();
  }

  componentWillUnmount() {
    authStore.removeAdMobReward();
  }

  render() {
    return (
      <Container style={styles.container}>
        <Notification />
        <Admob />
        <Content style={styles.content}>
          {/* ID */}
          <Separator bordered>
            <Text>ID</Text>
          </Separator>
          <ListItem last>
            <Body>
              <Text>{authStore.me.id}</Text>
            </Body>
          </ListItem>
          {/* version */}
          <Separator bordered>
            <Text>Version</Text>
          </Separator>
          <ListItem last>
            <Body>
              <Text>{app.expo.version}</Text>
            </Body>
          </ListItem>
          {/* point */}
          <Separator bordered>
            <Text>Point</Text>
          </Separator>
          <ListItem >
            <Body>
              <Text>보유 포인트 : {authStore.me.point}</Text>
            </Body>
          </ListItem>
          <ListItem onPress={() => this.props.navigation.navigate('Payment')}>
            <Body>
              <Text>포인트 구매하기</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem last onPress={() => authStore.showAdMobReward()}>
            <Body>
              <Text>포인트 보상받기</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          {/* push */}
          <Separator bordered>
            <Text>Push</Text>
          </Separator>
          <ListItem last>
            <Body>
              <Switch value={authStore.me.isActivePush} onValueChange={(evt) => this._change(evt)} />
            </Body>
          </ListItem>
          {/* terms */}
          <Separator bordered>
            <Text>Terms</Text>
          </Separator>
          <ListItem last onPress={() => this.props.navigation.navigate('Term')}>
            <Body>
              <Text>약관 및 개인정보처리방침</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <Separator bordered />
          <Button block title="update" onPress={(e) => this._showAlert(e)} style={styles.formBoxButton}>
            <Text>계정 탈퇴</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

if (Platform.OS === 'android') {
  SettingsScreen.navigationOptions = {
    header: null,
  };
} else {
  SettingsScreen.navigationOptions = {
    headerTitle: (
      <Image style={{ width: 30, height: 30 }} source={require('./../assets/images/header.png')} />
    ),
  };
}

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 60
  },
  content: {
    // top: 60
  },
  formBoxButton: {
    margin: 30,
    backgroundColor: Colors.tintColor
  },
  bottomBanner: {
    position: "absolute",
    top: 0,
    zIndex: 2,
  },
});