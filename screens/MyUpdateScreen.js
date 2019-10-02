import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator, Thumbnail, Grid, Col,
  Button, Text, Icon, Left, Body, Right, DatePicker, Textarea, Input, ActionSheet
} from 'native-base';
import {
  StyleSheet, Dimensions,
  Alert, TouchableHighlight
} from 'react-native';
import { observer } from 'mobx-react';
import { ImagePicker, Permissions, Constants } from 'expo';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { locations, gender, age } from '../constants/Items';
import userService from './../services/users';
import authStore from './../stores/AuthStore';
import userStore from './../stores/UserStore';

@observer
export default class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Profile',
      navigatorStyle: {
        navBarHidden: false,
      },
      headerLeft: (
        <Icon name='md-arrow-round-back'
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: 'rgba(0, 0, 0, .9)',
            marginHorizontal: 16,
            textAlign: 'center',
          }}
          onPress={() => navigation.navigate('My')}
        />
      ),
    }
  };


  constructor(props) {
    super(props);
    this._user = userService;
  }

  _action = async (index) => {
    console.log(authStore.images[index].thumbnail)
    if (authStore.images[index].thumbnail == null) this._pickImage();
    else this._openActionSheet(index);
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.cancelled) {
      authStore.uploadImage(result.uri);
    }
  };

  _deleteImage = async (index) => {
    authStore.deleteImage(index);
  }

  _openActionSheet = async (index) => {
    ActionSheet.show(
      {
        options: [
          { text: "Delete", icon: "trash", iconColor: "#fa213b" },
          { text: "Cancle", icon: "close", iconColor: "#25de5b" }
        ],
        cancelButtonIndex: 1,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this._deleteImage(index);
            break;
          default:
            break;
        }
      }
    )
  }

  _save = async () => {
    let res = await userStore.updateUser(authStore.me.name,
      authStore.me.location,
      authStore.me.intro,
      authStore.me.gender,
      authStore.age
    );    
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
                  <TouchableHighlight onPress={() => this._action(0)} underlayColor="#ffffff00">
                    <Thumbnail large source={{ uri: authStore.images[0].thumbnail }} style={styles.ImageBox} />
                  </TouchableHighlight>
                </Col>
                <Col style={{ alignSelf: 'center' }}>
                  <TouchableHighlight onPress={() => this._action(1)} underlayColor="#ffffff00">
                    <Thumbnail large source={{ uri: authStore.images[1].thumbnail }} style={styles.ImageBox} />
                  </TouchableHighlight>
                </Col>
                <Col style={{ alignSelf: 'center' }}>
                  <TouchableHighlight onPress={() => this._action(2)} underlayColor="#ffffff00">
                    <Thumbnail large source={{ uri: authStore.images[2].thumbnail }} style={styles.ImageBox} />
                  </TouchableHighlight>
                </Col>
              </Grid>
              <Grid style={{ marginTop: 10 }}>
                <Col>
                  <TouchableHighlight onPress={() => this._action(3)} underlayColor="#ffffff00">
                    <Thumbnail large source={{ uri: authStore.images[3].thumbnail }} style={styles.ImageBox} />
                  </TouchableHighlight>
                </Col>
                <Col>
                  <TouchableHighlight onPress={() => this._action(4)} underlayColor="#ffffff00">
                    <Thumbnail large source={{ uri: authStore.images[4].thumbnail }} style={styles.ImageBox} />
                  </TouchableHighlight>
                </Col>
                <Col>
                  <TouchableHighlight onPress={() => this._action(5)} underlayColor="#ffffff00">
                    <Thumbnail large source={{ uri: authStore.images[5].thumbnail }} style={styles.ImageBox} />
                  </TouchableHighlight>
                </Col>
              </Grid>
            </Body>
          </ListItem>
          {/* name */}
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
          {/* <ListItem icon>
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
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText=""
                textStyle={{ color: "black", margin: 0, padding: 0 }}
                placeHolderTextStyle={{ color: "#fff" }}
                onDateChange={() => authStore.me.birth}
              />
            </Body>
            <Right>
            </Right>
          </ListItem> */}
          {/* age */}
          <ListItem icon >
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="locate" />
              </Button>
            </Left>
            <Body>
              <RNPickerSelect
                placeholder={{}}
                items={age}
                onValueChange={val => {
                  authStore.age = val
                }}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={authStore.age}
              />
            </Body>
          </ListItem>
          {/* gender */}
          <ListItem icon >
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="locate" />
              </Button>
            </Left>
            <Body>
              <RNPickerSelect
                placeholder={{}}
                items={gender}
                onValueChange={val => {
                  authStore.me.gender = val
                }}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={authStore.me.gender}
              />
            </Body>
          </ListItem>
          {/* location */}
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

const styles = StyleSheet.create({
  ImageBox: {
    width: (Dimensions.get('window').width / 3.5),
    height: (Dimensions.get('window').width / 3.5),
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