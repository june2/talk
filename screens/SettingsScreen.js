import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator, Thumbnail,
  Button, Text, Icon, Left, Body, Right, Switch
} from 'native-base';
import {
  AsyncStorage,
} from 'react-native';
import { Alert } from 'react-native';
import { observer } from 'mobx-react';
import userStore from './../stores/UserStore';

@observer
export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
  }

  logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <Container>
        <Content>
          <ListItem>
            <Text>{userStore.me.email}</Text>
          </ListItem>
          <Separator bordered />
          <ListItem>
            {userStore.me.images.map((obj, i) => {
              console.log(obj.thumbnail)
              return (
                <Thumbnail key={i} large source={{ uri: obj.thumbnail }} />)
            })}
          </ListItem>
          <Separator bordered />
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="ios-person" />
              </Button>
            </Left>
            <Body>
              <Text>{userStore.me.email}</Text>
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="bluetooth" />
              </Button>
            </Left>
            <Body>
              <Text>{userStore.me.locaiton}</Text>
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="airplane" />
              </Button>
            </Left>
            <Body>
              <Text>Push</Text>
            </Body>
            <Right>
              <Switch value={false} />
            </Right>
          </ListItem>
          <Separator bordered />
          <Button block light onPress={(e) => this.logOut(e)}>
            <Text>LOGOUT</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'my pqge',
};
