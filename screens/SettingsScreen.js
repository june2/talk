import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator,
  Button, Text, Icon, Left, Right, Body, Switch
} from 'native-base';
import {
  AsyncStorage,
  StyleSheet,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react';
import { AdMobBanner } from 'expo-ads-admob'
import userService from './../services/users';
import authStore from './../stores/AuthStore';

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
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this._logOut() },
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

  render() {
    return (
      <Container style={styles.container}>
        <AdMobBanner
          style={styles.bottomBanner}
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-3940256099942544/6300978111"
          // Test ID, Replace with your-admob-unit-id
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={(err) => console.log(err)}
          onAdMobDispatchAppEvent={(evt) => console.log(evt)}
        />
        <Content style={styles.content}>
          {/* ID */}
          <Separator bordered>
            <Text>ID</Text>
          </Separator>
          <ListItem icon last>
            {/* <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="ios-person" />
              </Button>
            </Left> */}
            <Body>
              <Text>{authStore.me.id}</Text>
            </Body>
          </ListItem>
          {/* email */}
          {/* <Separator bordered>
            <Text>E-mail</Text>
          </Separator>
          <ListItem icon last>
            <Body>
              <Text>{authStore.me.email}</Text>
            </Body>
          </ListItem> */}
          {/* point */}
          <Separator bordered>
            <Text>Point</Text>
          </Separator>
          <ListItem icon >
            {/* <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="ios-person" />
              </Button>
            </Left> */}
            <Body>
              <Text>{authStore.me.point}</Text>
            </Body>
          </ListItem>
          <ListItem icon last onPress={() => this.props.navigation.navigate('Term')}>
            <Body>
              <Text>700 포인트 구매</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon last onPress={() => this.props.navigation.navigate('Term')}>
            <Body>
              <Text>4000 포인트 구매</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon last onPress={() => this.props.navigation.navigate('Term')}>
            <Body>
              <Text>8000 포인트 구매</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          {/* push */}
          <Separator bordered>
            <Text>Push</Text>
          </Separator>
          <ListItem icon last>
            <Body>
              <Switch value={authStore.me.isActivePush} onValueChange={(evt) => this._change(evt)} />
            </Body>
          </ListItem>
          <Separator bordered>
            <Text>Terms</Text>
          </Separator>
          <ListItem icon onPress={() => this.props.navigation.navigate('Term')}>
            <Body>
              <Text>약관</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon last onPress={() => this.props.navigation.navigate('Term')}>
            <Body>
              <Text>약관</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <Separator bordered />
          <Button block title="update" onPress={(e) => this._showAlert(e)} style={styles.formBoxButton}>
            <Text>계겅 탈퇴</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

SettingsScreen.navigationOptions = {
  // title: 'Setting',
  // header: null,
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60    
  },
  content: {
    top: 60
  },
  formBoxButton: {
    margin: 30
  },
  bottomBanner: {
    position: "absolute",
    top: 0,
    zIndex: 2,
  },
});