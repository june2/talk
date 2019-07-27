import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
} from 'react-native';
import {
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
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Content contentContainerStyle={styles.content}>
            <Text style={styles.logoBoxTitle}>TALK</Text>
            <Text style={styles.logoBoxSub}>TALK TALK</Text>
          </Content>
        </View>
        <View style={styles.formBox}>
          <Content contentContainerStyle={styles.content}>
            <Form>
              <Item inlineLabel>
                <Label>      E-mail</Label>
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
            <Button block title="Sing up" onPress={this._signUpAsync} style={styles.formBoxButton}>
              <Text>Sing up</Text>
            </Button>
          </Content>
        </View>
        <View style={styles.bottomBox}>
          <Content contentContainerStyle={styles.content}>
            <Text style={styles.bottomBoxText}>
              이미 계정이 없으신가요?&nbsp;&nbsp;&nbsp;
            <Text onPress={() => this.props.navigation.navigate('SignIn')} style={styles.bottomBoxTextLink}>
                로그인
            </Text>
            </Text>
          </Content>
        </View>
      </View >
    );
  }
}

RegisterScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoBox: {
    flex: 1.2,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  logoBoxTitle: {
    alignSelf: 'center',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 48,
  },
  logoBoxSub: {
    alignSelf: 'center',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 22,
    marginTop: -10
  },
  formBox: {
    flex: 1,
  },
  formBoxButton: {
    margin: 30
  },
  bottomBox: {
    flex: 1,
  },
  bottomBoxText: {
    flex: 1.5,
    top: 60,
    alignSelf: 'center',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 12,
  },
  bottomBoxTextLink: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

