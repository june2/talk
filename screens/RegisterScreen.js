import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Button,
  Text,
} from 'native-base';
import { observer } from 'mobx-react';
import { Alert } from 'react-native';
import authService from '../services/auth'
import authStore from './../stores/AuthStore';

@observer
export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this._auth = authService;
    this.state = {
      email: 'test@test.com',
      password: 'string'
    }
  }

  _signUpAsync = async () => {
    try {
      let res = await authStore.register(this.state.email, this.state.password);
      if (res.id) {
        res = await this._auth.login(this.state.email, this.state.password);
        await AsyncStorage.setItem('token', res.accessToken);
        this.props.navigation.navigate('Settings');
      }
    } catch (err) {
      Alert.alert('Error', err.message)
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <View>
            <Form>
              <Item inlineLabel>
                <Label>Username</Label>
                <Input
                  ref="emailInput"
                  onChangeText={(text) => this.setState({ email: text })}
                  value={this.state.email}
                />
              </Item>
              <Item inlineLabel>
                <Label>Password</Label>
                <Input
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                />
              </Item>
            </Form>
          </View>
          <Button block light title="Sign up!" onPress={this._signUpAsync} >
            <Text>Sign up</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

RegisterScreen.navigationOptions = {
  title: 'Register',
};
