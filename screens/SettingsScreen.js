import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator, Thumbnail,
  Button, Text, Icon, Left, Body, Right, Switch, DatePicker, Textarea, Input
} from 'native-base';
import {
  AsyncStorage,
  StyleSheet,
  ScrollView,
  Alert, TouchableHighlight
} from 'react-native';
import { observer } from 'mobx-react';
import { ImagePicker, Permissions, Constants } from 'expo';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import config from '../constants/Config';
import locations from '../constants/Location';
import userService from './../services/users';
import authStore from './../stores/AuthStore';
import userStore from './../stores/UserStore';

@observer
export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this._user = userService;
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      authStore.me = await this._user.uploadImage(result.uri);
    }
  };

  _save = async () => {
    let res = await userService.updateMe(authStore.me.name, authStore.me.locaiton, authStore.me.intro);
    if(res.status === 200) this.props.navigation.navigate('My');    
    else Alert.alert('Server error')
  }

  _logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      throw new Error('Camera permission not granted');
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <ListItem>
            <ScrollView horizontal={true}>
              <TouchableHighlight onPress={() => this._pickImage()} >
                <Thumbnail large onPress={() => this._pickImage()} style={styles.ImageBoxImg} />
              </TouchableHighlight>
              {authStore.me.images.map((obj, i) => {
                console.log(obj.thumbnail)
                return (
                  <Thumbnail key={i} large source={{ uri: config.apiHost + obj.thumbnail }} style={styles.ImageBoxImg} />)
              })}
            </ScrollView>
          </ListItem>
          <Separator bordered />
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="ios-person" />
              </Button>
            </Left>
            <Body>
              <Text>{authStore.me.email}</Text>
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="ios-person" />
              </Button>
            </Left>
            <Body>
              <Input
                value={authStore.me.name}
                onChangeText={val => { authStore.me.name = val }}
              />
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="calendar" />
              </Button>
            </Left>
            <Body>
              <DatePicker
                defaultDate={new Date(2018, 4, 4)}
                minimumDate={new Date(2018, 1, 1)}
                maximumDate={new Date(2018, 12, 31)}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={true}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText=""
                textStyle={{ color: "black", margin: 0 }}
                placeHolderTextStyle={{ color: "#fff" }}
                onDateChange={() => authStore.me.birth}
              />
            </Body>
            <Right>
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="locate" />
              </Button>
            </Left>
            <Body>
              <RNPickerSelect
                placeholder={{}}
                items={locations}
                onValueChange={val => {
                  authStore.me.location = val
                }}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={authStore.me.location}
              />
            </Body>
          </ListItem>
          <ListItem icon last>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="airplane" />
              </Button>
            </Left>
            <Body>
              <Textarea rowSpan={1} placeholder="" />
            </Body>
          </ListItem>
          <Separator bordered />
          <Button block light onPress={(e) => this._logOut(e)}>
            <Text>LOGOUT</Text>
          </Button>
          <Button block title="update" onPress={() => this._save()} style={styles.formBoxButton}>
            <Text>저장</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'my pqge',
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