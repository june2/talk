import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator, Thumbnail, Grid, Col,
  Button, Text, Icon, Left, Body, Textarea, Input, ActionSheet,
  Label
} from 'native-base';
import {
  StyleSheet, Dimensions,
  Alert, TouchableHighlight,
  Modal,
  View,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import RNPickerSelect from 'react-native-picker-select';
import { locations, gender, age } from '../constants/Items';
import Colors from './../constants/Colors'
import { getYear } from '../components/Util';
import authStore from './../stores/AuthStore';

@observer
export default class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '',
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
          onPress={async () => {
            let data = {
              name: authStore.me.name,
              location: authStore.me.location,
              intro: authStore.me.intro,
              gender: authStore.me.gender,
              birthday: authStore.me.birthday,
            }
            authStore.updateMe(data);
            navigation.goBack();
          }}
        />
      ),
    }
  };


  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  _action = async (index) => {
    if (index >= authStore.me.images.length) this._pickImage();
    else this._openActionSheet(index);
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
      });
      if (!result.cancelled) {
        this.setState({ isLoading: true });
        await authStore.uploadImage(result.uri);
        this.setState({ isLoading: false });
      }
    } catch (err) {
      this.setState({ isLoading: false });
      Alert.alert('서버 에러입니다.');
    }
  };

  _deleteImage = async (index) => {
    authStore.deleteImage(index);
  }

  _openActionSheet = async (index) => {
    ActionSheet.show(
      {
        options: [
          { text: "삭제", icon: "trash", iconColor: "#fa213b" },
          { text: "취소", icon: "close", iconColor: "#25de5b" }
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
    let data = {
      name: authStore.me.name,
      location: authStore.me.location,
      intro: authStore.me.intro,
      gender: authStore.me.gender,
      birthday: authStore.me.birthday,
    }
    let res = await authStore.updateMe(data);
    if (res.status === 200) this.props.navigation.navigate('My');
    else Alert.alert('Server error');
  }

  componentDidMount() {
    // this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      // Alert.alert('사진 사용을 허용해주세요!');
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ android: 'padding', ios: null })}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 85 })}
        style={{ flex: 1 }}
      >
        <Container>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isLoading}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
            }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>

            </View>
          </Modal>
          <Content>
            <ListItem>
              <Body>
                <Grid>
                  <Col style={{ alignSelf: 'center' }}>
                    <TouchableHighlight onPress={() => this._action(0)} underlayColor="#ffffff00">
                      <Thumbnail large source={{ uri: (authStore.me.images.length > 0) ? authStore.me.images[0] : null }} style={styles.ImageBox} />
                    </TouchableHighlight>
                  </Col>
                  <Col style={{ alignSelf: 'center' }}>
                    <TouchableHighlight onPress={() => this._action(1)} underlayColor="#ffffff00">
                      <Thumbnail large source={{ uri: (authStore.me.images.length > 1) ? authStore.me.images[1] : null }} style={styles.ImageBox} />
                    </TouchableHighlight>
                  </Col>
                  <Col style={{ alignSelf: 'center' }}>
                    <TouchableHighlight onPress={() => this._action(2)} underlayColor="#ffffff00">
                      <Thumbnail large source={{ uri: (authStore.me.images.length > 2) ? authStore.me.images[2] : null }} style={styles.ImageBox} />
                    </TouchableHighlight>
                  </Col>
                </Grid>
                <Grid style={{ marginTop: 10 }}>
                  <Col>
                    <TouchableHighlight onPress={() => this._action(3)} underlayColor="#ffffff00">
                      <Thumbnail large source={{ uri: (authStore.me.images.length > 3) ? authStore.me.images[3] : null }} style={styles.ImageBox} />
                    </TouchableHighlight>
                  </Col>
                  <Col>
                    <TouchableHighlight onPress={() => this._action(4)} underlayColor="#ffffff00">
                      <Thumbnail large source={{ uri: (authStore.me.images.length > 4) ? authStore.me.images[4] : null }} style={styles.ImageBox} />
                    </TouchableHighlight>
                  </Col>
                  <Col>
                    <TouchableHighlight onPress={() => this._action(5)} underlayColor="#ffffff00">
                      <Thumbnail large source={{ uri: (authStore.me.images.length > 5) ? authStore.me.images[5] : null }} style={styles.ImageBox} />
                    </TouchableHighlight>
                  </Col>
                </Grid>
              </Body>
            </ListItem>
            <Separator bordered>
              <Text>Information</Text>
            </Separator>
            {/* gender */}
            <ListItem icon >
              <Left>
                <Label style={styles.label}>성별</Label>
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
            {/* age */}
            <ListItem icon >
              <Left>
                <Label style={styles.label}>나이</Label>
              </Left>
              <Body>
                <RNPickerSelect
                  placeholder={{}}
                  items={age}
                  onValueChange={val => {
                    authStore.me.birthday = new Date(`${val}-01-01`);
                  }}
                  InputAccessoryView={() => null}
                  style={pickerSelectStyles}
                  value={getYear(authStore.me.birthday)}
                />
              </Body>
            </ListItem>
            {/* location */}
            <ListItem icon >
              <Left>
                <Label style={styles.label}>지역</Label>
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
            {/* 닉네임 */}
            <ListItem icon last>
              <Left>
                <Label style={styles.label}>닉네임</Label>
              </Left>
              <Body>
                <Input
                  value={authStore.me.name}
                  style={{ paddingLeft: 0 }}
                  maxLength={24}
                  onChangeText={val => { authStore.me.name = val }}
                />
              </Body>
            </ListItem>
            <Separator bordered>
              <Text>About me</Text>
            </Separator>
            <ListItem>
              <Body>
                <Textarea rowSpan={4} maxLength={220} placeholder="" onChangeText={(text) => authStore.me.intro = text} value={authStore.me.intro} />
              </Body>
            </ListItem>
            <Separator bordered />
            <Button block title="update" onPress={() => this._save()} style={styles.formBoxButton}>
              <Text>저장</Text>
            </Button>
          </Content>
        </Container>
      </KeyboardAvoidingView>
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
  label: {
    color: Colors.textColor
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    height: 40
  },
  inputAndroid: {
    fontSize: 16,
  },
});