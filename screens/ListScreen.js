import React, { Component } from 'react';
import {
  FlatList,
} from 'react-native';
import {
  ListItem, Left, Body, Right,
  Thumbnail, Text
} from 'native-base';
import { observer } from 'mobx-react';
import roomStore from './../stores/RoomStore';

@observer
export default class LinkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      data: [],
      totalDocs: 0,
      offset: 0,
      limit: 0
    }
  }

  _handleRefresh = () => {
    this.setState({
      refreshing: true,
      offset: 0,
    }, this._getData);
  }

  _handleClick(id) {
    this.props.navigation.navigate('Chat', { roomId: id });
    // this.props.navigation.navigate('Chat')
    // Alert.alert("I am clicked");     
  }

  _renderItem = ({ item }, i) => (
    <ListItem avatar key={i} button={true} onPress={() => this._handleClick(item.id)}>
      <Left>
        <Thumbnail source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }} />
      </Left>
      <Body>
        {/* <Text>{(item.users) ? item.users[0].name : ''}</Text> */}
        <Text note>{item.lastMsg}</Text>
        <Text note>{item.lastMsg}</Text>
      </Body>
      <Right>
        <Text note>3:43 pm</Text>
      </Right>
    </ListItem>
  );

  _getData = async () => {
    if (this.state.totalDocs >= this.state.limit * this.state.offset) {
      let res = await roomStore.getRooms();
      let data = res.docs;
      this.setState({
        data: this.state.refreshing ? data : this.state.data.concat(data),
        offset: res.offset + 1,
        limit: res.limit,
        totalDocs: res.totalDocs,
        refreshing: false
      })
    }
  }

  _handleLoadMore = () => {
    this._getData();
  }

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this._handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshing={this.state.refreshing}
        onRefresh={this._handleRefresh}
      />
    );
  }
}

LinkScreen.navigationOptions = {
  title: 'Chat',
};