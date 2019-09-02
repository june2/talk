import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator, Thumbnail, Grid, Col,
  Button, Text, Icon, Left, Body, Right, DatePicker, Textarea, Input
} from 'native-base';
import {
  StyleSheet,
  Alert, TouchableHighlight
} from 'react-native';
import { observer } from 'mobx-react';
import { ImagePicker, Permissions, Constants } from 'expo';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import moment from 'moment';
import config from '../constants/Config';
import locations from '../constants/Location';
import userService from './../services/users';
import authStore from './../stores/AuthStore';

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
      aspect: [3, 4],
    });
    if (!result.cancelled) {
      authStore.me = await this._user.uploadImage(result.uri);
    }
  };

  _save = async () => {
    let res = await userService.updateMe(authStore.me.name, authStore.me.location, authStore.me.intro);
    if (res.status === 200) this.props.navigation.navigate('My');
    else Alert.alert('Server error')
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
            <Body>
              <Grid>
                <Col style={{ alignSelf: 'center' }}>
                  <TouchableHighlight onPress={() => this._pickImage()} >
                    <Thumbnail large style={styles.ImageBox} />
                  </TouchableHighlight>
                </Col>
                <Col style={{ alignSelf: 'center' }}>
                  <Thumbnail large source={{ uri: authStore.images[0].thumbnail }} style={styles.ImageBox} />
                </Col>
                <Col style={{ alignSelf: 'center' }}>
                  <Thumbnail large source={{ uri: authStore.images[1].thumbnail }} style={styles.ImageBox} />
                </Col>
              </Grid>
              <Grid style={{ marginTop: 10 }}>
                <Col>
                  <Thumbnail large source={{ uri: authStore.images[2].thumbnail }} style={styles.ImageBox} />
                </Col>
                <Col>
                  <Thumbnail large source={{ uri: authStore.images[3].thumbnail }} style={styles.ImageBox} />
                </Col>
                <Col>
                  <Thumbnail large source={{ uri: authStore.images[4].thumbnail }} style={styles.ImageBox} />
                </Col>
              </Grid>
            </Body>
          </ListItem>
          <Separator bordered>
            <Text>ID</Text>
          </Separator>
          <ListItem icon last>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="ios-person" />
              </Button>
            </Left>
            <Body>
              <Text>{authStore.me.email}</Text>
            </Body>
          </ListItem>
          <Separator bordered>
            <Text>Information</Text>
          </Separator>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="ios-person" />
              </Button>
            </Left>
            <Body>
              <Input
                value={authStore.me.name}
                style={{ paddingLeft: 0 }}
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
                defaultDate={new Date(1900, 1, 1)}
                minimumDate={new Date(1950, 1, 1)}
                maximumDate={new Date(2000, 12, 31)}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                formatChosenDate={date => { return moment(date).format('YYYY-MM-DD'); }}
                modalTransparent={true}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText=""
                textStyle={{ color: "black", margin: 0, padding: 0 }}
                style={{ backgroundColor: "#fff" }}
                placeHolderTextStyle={{ color: "#fff" }}
                onDateChange={() => authStore.me.birth}
              />
            </Body>
            <Right>
            </Right>
          </ListItem>
          <ListItem icon last>
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
          <Separator bordered>
            <Text>About me</Text>
          </Separator>
          <ListItem>
            <Body>
              <Textarea rowSpan={4} placeholder="" onChangeText={(text) => authStore.me.intro = text} value={authStore.me.intro} />
            </Body>
          </ListItem>
          <Separator bordered />
          <Button block title="update" onPress={() => this._save()} style={styles.formBoxButton}>
            <Text>저장</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

SettingsScreen.navigationOptions = {
  // title: 'my pqge',
};

const styles = StyleSheet.create({
  ImageBox: {
    width: 120,
    height: 120,
    backgroundColor: 'gray',
    alignSelf: 'center'
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