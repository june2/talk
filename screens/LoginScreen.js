import React from 'react';
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
import { Alert } from 'react-native';
import authService from './../services/auth'

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this._auth = authService;
    this.state = {
      email: 'test@test.com',
      password: 'string'
    }
  }

  _signInAsync = async () => {
    try {
      let res = await this._auth.login(this.state.email, this.state.password);
      await AsyncStorage.setItem('token', res.accessToken);
      this.props.navigation.navigate('Main');
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
          <Button block light title="Sign in!" onPress={this._signInAsync} >
            <Text>Login</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

LoginScreen.navigationOptions = {
  title: 'Login',
};
