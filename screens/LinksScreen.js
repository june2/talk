import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Button, Text } from 'native-base';
import { Alert } from 'react-native';
import { observer, inject } from 'mobx-react';
import userStore from './../stores/UserStore';

@observer
export default class LinkScreen extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    userStore.getMe();
  }

  handleClick() {
    this.props.navigation.navigate('Chat')
    // Alert.alert("I am clicked"); 
  }

  render() {
    var rows = [];

    for (var i = 0; i < 20; i++) {
      rows.push(
        <ListItem avatar key={i} button={true} onPress={this.handleClick}>
          <Left>
            <Thumbnail source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
      );
    }
    return (
      <Container>
        <Content>
          <List>
            {rows}
          </List>
        </Content>
      </Container>
    );
  }
}

LinkScreen.navigationOptions = {
  title: 'List',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
