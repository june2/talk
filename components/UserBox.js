import React, { Component } from 'react';
import {
  Modal, TouchableHighlight,
  View, Alert,
  Image
} from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { observer } from 'mobx-react';
import userStore from './../stores/UserStore';

@observer
export default class UserBox extends Component {
  constructor(props) {
    super(props);
  }

  _handleClick() {
    // this.props.navigation.navigate('Chat')
  }

  render() {
    return (
      <View>
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }} />
              <Body>
                <Text>NativeBase</Text>
                <Text note>GeekyAnts</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Image
              source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }}
              style={{
                flex: 1,
                width: 200,
                height: 200,
                resizeMode: 'contain'
              }}
            />
            {/* <Image source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }} /> */}
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent onPress={() => this._handleClick()}>
                <Icon active name="thumbs-up" />
                <Text>12 Likes</Text>
              </Button>
            </Left>
            <Body>
              <Button transparent>
                <Icon active name="chatbubbles" />
                <Text>4 Comments</Text>
              </Button>
            </Body>
            <Right>
              <Text>11h ago</Text>
            </Right>
          </CardItem>
        </Card>

        <TouchableHighlight
          onPress={() => this.props.closeModal(false)}>
          <Text>Hide Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}