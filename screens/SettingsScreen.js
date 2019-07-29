import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator, Thumbnail,
  Button, Text, Icon, Left, Body, Right, Switch, DatePicker
} from 'native-base';
import {
  AsyncStorage,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Alert, TouchableHighlight } from 'react-native';
import { observer } from 'mobx-react';
import { ImagePicker, Permissions, Constants } from 'expo';
import config from '../constants/Config';
import userService from './../services/users';
import authStore from './../stores/AuthStore';
import userStore from './../stores/UserStore';

@observer
export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this._user = userService;
    this.state = { chosenDate: new Date() };
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
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

  logOut = async () => {
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
                placeHolderText="Select date"
                textStyle={{ color: "black", margin: 0 }}
                placeHolderTextStyle={{ color: "#fff" }}
                onDateChange={this.setDate}
              />
            </Body>
            <Right>
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="bluetooth" />
              </Button>
            </Left>
            <Body>
              <Text>{authStore.me.locaiton}</Text>
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

const styles = StyleSheet.create({
  ImageBoxImg: {
    backgroundColor: 'gray',
    marginRight: 15,
  },
});
