import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator, Thumbnail,
  Button, Text, Icon, Left, Body, Right, Switch
} from 'native-base';
import {
  StyleSheet,
} from 'react-native';
import { Alert } from 'react-native';
import { observer } from 'mobx-react';
import { ImagePicker, Permissions, Constants } from 'expo';
import authStore from './../stores/AuthStore';

@observer
export default class MyUpdateScreen extends Component {
  constructor(props) {
    super(props);
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <ListItem>
            {authStore.me.images.map((obj, i) => {
              console.log(obj.thumbnail)
              return (
                <Thumbnail key={i} large source={{ uri: obj.thumbnail }} />)
            })}
          </ListItem>
          <Separator bordered />
          <ListItem>
            <Text>{authStore.me.email}</Text>
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

MyUpdateScreen.navigationOptions = {
  // header: null,
  // title: 'My page update'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
