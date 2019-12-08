import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Alert,
  Image,
  Modal,
  Platform,
  KeyboardAvoidingView
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
  Grid,
  Spinner,
} from 'native-base';
import { observer } from 'mobx-react';
import RNPickerSelect from 'react-native-picker-select';
import firebase from 'react-native-firebase';
import * as Localization from 'expo-localization';
import { locations, gender, age, getTimestamp } from '../constants/Items';
import authService from '../services/auth'
import authStore from './../stores/AuthStore';
import Colors from './../constants/Colors'
import i18n from './../i18n'

@observer
export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this._auth = authService;
    this.state = {
      email: `${getTimestamp}@talk.com`,
      password: 'password',
      name: null,
      gender: 'M',
      location: 'seoul',
      age: 1990,
      locale: Localization.locale,
      region: Localization.region,
      isLoading: false
    }
  }

  _signUpAsync = async () => {
    try {
      this.setState({ isLoading: true })
      let token = await firebase.messaging().getToken();
      if (!this.state.name) {
        this.setState({ isLoading: false })
        return Alert.alert(`${i18n.t('Please input nickname!')}`);
      }
      let res = await authStore.register(
        this.state.email, this.state.password,
        this.state.name, this.state.gender,
        new Date(`${this.state.age}-01-01`), this.state.location,
        this.state.locale, this.state.region,
        Platform.OS, Platform.Version, token
      );
      if (res.id) {
        res = await this._auth.login(this.state.email, this.state.password);
        await AsyncStorage.setItem('token', res.accessToken);
        await authStore.getMe();
        authStore.token = res.accessToken;
        this.props.navigation.navigate('Users');
      }
      this.setState({ isLoading: false })
    } catch (err) {
      this.setState({ isLoading: false })
      Alert.alert('Error', err.message)
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ android: 'padding', ios: null })}
        style={{ flex: 1 }}
      >
        <Container style={styles.container}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isLoading}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <Spinner color={Colors.spinner} />
            </View>
          </Modal>
          <View style={styles.container}>
            <Grid></Grid>
            <View style={styles.logoBox}>
              <Image
                source={require('./../assets/images/logo.png')}
                resizeMode='contain'
                style={styles.logoBoxImg}
              />
            </View>
            <View style={styles.middleBox}>
              <Content contentContainerStyle={styles.content} >
                <Form style={styles.formBox}>
                  <Item inlineLabel style={styles.formBoxItem}>
                    <Label style={styles.label}>{i18n.t('Nickname')}</Label>
                    <Input
                      style={styles.label}
                      onChangeText={(text) => this.setState({ name: text })}
                      maxLength={26}
                      value={this.state.name}
                    />
                  </Item>
                  <Item inlineLabel style={styles.formBoxItem}>
                    <Label style={styles.label}>{i18n.t('Gender')}</Label>
                    <Grid>
                      <RNPickerSelect
                        placeholder={{}}
                        items={gender}
                        onValueChange={val => {
                          this.setState({ gender: val })
                        }}
                        InputAccessoryView={() => null}
                        style={pickerSelectStyles}
                        value={this.state.gender}
                      />
                    </Grid>
                  </Item>
                  <Item inlineLabel style={styles.formBoxItem}>
                    <Label style={styles.label}>{i18n.t('Age')}</Label>
                    <Grid>
                      <RNPickerSelect
                        placeholder={{}}
                        items={age}
                        onValueChange={val => {
                          this.setState({ age: val })
                        }}
                        InputAccessoryView={() => null}
                        style={pickerSelectStyles}
                        value={this.state.age}
                      />
                    </Grid>
                  </Item>
                  <Item inlineLabel style={styles.formBoxItem}>
                    <Label style={styles.label}>{i18n.t('District')}</Label>
                    <Grid>
                      <RNPickerSelect
                        placeholder={{}}
                        items={locations}
                        onValueChange={val => {
                          this.setState({ location: val })
                        }}
                        InputAccessoryView={() => null}
                        style={pickerSelectStyles}
                        value={this.state.location}
                      />
                    </Grid>
                  </Item>
                  <Button block title="Sing up" onPress={this._signUpAsync} style={styles.formBoxButton}>
                    <Text>{i18n.t('Getting started')}</Text>
                  </Button>
                </Form>
              </Content>
            </View>
            <View style={styles.bottomBox}>
              <Content contentContainerStyle={styles.content} scrollEnabled={false}>
              </Content>
            </View>
          </View >
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

RegisterScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tintColor,
  },
  logoBox: {
    flex: 1.5,
    alignItems: 'center',
    width: '100%',
  },
  logoBoxImg: {
    flex: 1,
    width: '40%',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  middleBox: {
    flex: 3,
  },
  formBox: {
    width: '100%',
    position: 'absolute',
    top: 0
  },
  label: {
    color: Colors.noticeText
  },
  formBoxButton: {
    margin: 30
  },
  formBoxItem: {
    marginLeft: 32,
    marginRight: 32,
    height: 50,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: Colors.noticeText,
    fontSize: 16,
    width: '100%'
  },
  inputAndroidContainer: {
    width: 2000,
    height: 50,
  },
  inputAndroid: {
    color: Colors.noticeText,
    fontSize: 16,
    width: '100%',
    height: 50,
  },
  viewContainer: {
    width: '100%'
  },
});