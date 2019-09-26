import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator,
  Button, Text, Icon, Left, Right, Body,
} from 'native-base';
import {
  AsyncStorage,
  StyleSheet,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react';
import userService from './../services/users';
import authStore from './../stores/AuthStore';

@observer
export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this._user = userService;
  }

  _save = async () => {
    let res = await userService.updateMe(authStore.me.name, authStore.me.locaiton, authStore.me.intro);
    if (res.status === 200) this.props.navigation.navigate('My');
    else Alert.alert('Server error')
  }

  _logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')
  }

  componentDidMount() {

  }

  render() {
    return (
      <Container>        
        <Content>
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
              <Text>{authStore.me.email}</Text>
            </Body>
          </ListItem>
          <Separator bordered>
            <Text>Point</Text>
          </Separator>
          <ListItem icon last>
            {/* <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="ios-person" />
              </Button>
            </Left> */}
            <Body>
              <Text>{authStore.me.point}</Text>
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
          <Button block title="update" onPress={(e) => this._logOut(e)} style={styles.formBoxButton}>
            <Text>로그아웃</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'Setting',
  // header: null,
};

const styles = StyleSheet.create({
  ImageBoxImg: {
    backgroundColor: 'gray',
    marginRight: 15,
  },
  formBoxButton: {
    margin: 30
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
  },
  inputAndroid: {
    fontSize: 16,
  },
});