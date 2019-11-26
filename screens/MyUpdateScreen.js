import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator, Thumbnail, Grid, Col,
  Button, Text, Icon, Left, Body, Textarea, Input, ActionSheet,
  Label, Spinner
} from 'native-base';
import {
  StyleSheet,
  Alert,
  TouchableHighlight,
  Modal,
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
  PermissionsAndroid
} from 'react-native';
import { observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import RNPickerSelect from 'react-native-picker-select';
import { locations, gender, age } from '../constants/Items';
import Colors from './../constants/Colors'
import { window } from '../constants/Layout';
import { getYear } from '../components/Util';
import authStore from './../stores/AuthStore';
import i18n from './../i18n'

@observer
export default class MyUpdateScreen extends Component {
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
      } else {
        this.setState({ isLoading: false });
      }
    } catch (err) {
      this.setState({ isLoading: false });
      Alert.alert('Server Error', err);
    }
  };

  _deleteImage = async (index) => {
    authStore.deleteImage(index);
  }

  _openActionSheet = async (index) => {
    ActionSheet.show(
      {
        options: [
          { text: `${i18n.t('Delete')}`, icon: "trash", iconColor: "#fa213b" },
          { text: `${i18n.t('Cancel')}`, icon: "close", iconColor: "#25de5b" }
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
    else Alert.alert('서버 오류', err);
  }

  _getPermissionAsync = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(`${i18n.t('Please allow use of photo!')}`);
      }
    } else {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert(`${i18n.t('Please allow use of photo!')}`);
      }
    }
  }

  componentDidMount() {
    this._getPermissionAsync();
  }


  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ android: 'padding', ios: null })}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 85 })}
        style={{ flex: 1 }}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isLoading}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <Spinner color={Colors.spinner} />
          </View>
        </Modal>
        <Container>
          <Content>
            <ListItem last>
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
                <Label style={styles.label}>{i18n.t('Gender')}</Label>
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
                <Label style={styles.label}>{i18n.t('Age')}</Label>
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
                <Label style={styles.label}>{i18n.t('District')}</Label>
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
                <Label style={styles.label}>{i18n.t('Nickname')}</Label>
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
            <ListItem last>
              <Body>
                <Textarea rowSpan={4} maxLength={220} placeholder="" onChangeText={(text) => authStore.me.intro = text} value={authStore.me.intro} />
              </Body>
            </ListItem>
            <Separator bordered />
            <Button block title="update" onPress={() => this._save()} style={styles.formBoxButton}>
              <Text>{i18n.t('Save')}</Text>
            </Button>
          </Content>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

if (Platform.OS === 'android') {
  MyUpdateScreen.navigationOptions = {
    header: null,
  };
} else {
  MyUpdateScreen.navigationOptions = {
    headerTitle: (
      <Image style={{ width: 30, height: 30 }} source={require('./../assets/images/header.png')} />
    ),
  };
} 

const styles = StyleSheet.create({
  ImageBox: {
    width: (window.width / 3.5),
    height: (window.width / 3.5),
    backgroundColor: 'gray',
    alignSelf: 'center'
  },
  formBoxButton: {
    margin: 30,
    backgroundColor: Colors.tintColor
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