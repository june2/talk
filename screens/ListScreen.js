import React, { Component } from 'react';
import { ScrollView, StyleSheet, RefreshControl, ListView } from 'react-native';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Button, Text } from 'native-base';
import { Alert } from 'react-native';
import { observer, inject } from 'mobx-react';
import userStore from './../stores/UserStore';

@observer
export default class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this._handleClick = this._handleClick.bind(this);
  }

  componentWillMount() {
    userStore.getUsers();
  }

  _handleClick() {
    this.props.navigation.navigate('Chat')
    // Alert.alert("I am clicked"); 
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await userStore.getUsers();
    this.setState({ refreshing: false });
  }

  _setCurrentReadOffset = (event) => {
    console.log(1);
  }

  _onEndReached = (event) => {
    console.log(1);
  }

  render() {
    var rows = [];
    userStore.users.map((obj, i) => {
      rows.push(
        <ListItem avatar key={i} button={true} onPress={this._handleClick}>
          <Left>
            <Thumbnail source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }} />
          </Left>
          <Body>
            <Text>{obj.name}</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
      );
    })
    return (
      <Container>
        <Content
          // scrollEventThrottle={3000}
          // // onScroll={this._setCurrentReadOffset}
          // onEndReached={this._onEndReached}
          // removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              title="Loading..."
            />
          }>
          <List
            renderItem={[]}
            onEndReachedThreshold={10}
            onEndReached={({ distanceFromEnd }) => {
              console.log(12);
            }}
            ref='_flatList'
          >
            {rows}
          </List>
        </Content>
      </Container>
    );
  }
}

ListScreen.navigationOptions = {
  title: 'List',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
