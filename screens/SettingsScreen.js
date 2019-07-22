import React, { Component } from 'react';
import { Container, Content, ListItem, Button, Text, Icon, Left, Body, Right, Switch } from 'native-base';
import {
  AsyncStorage,
} from 'react-native';

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
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="airplane" />
              </Button>
            </Left>
            <Body>
              <Text>Airplane Mode</Text>
            </Body>
            <Right>
              <Switch value={false} />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="bluetooth" />
              </Button>
            </Left>
            <Body>
              <Text>Bluetooth</Text>
            </Body>
            <Right>
              <Text>On</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
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
