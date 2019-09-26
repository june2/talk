import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  ListItem, Left, Body, Right,
  Thumbnail, Text, View
} from 'native-base';
import { observer, Observer } from 'mobx-react';
import config from '../constants/Config';
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
      limit: 10
    }
  }

  _handleRefresh = () => {
    roomStore.list = [];
    this.setState({
      refreshing: true,
      offset: 0,
    }, this._getData);
  }

  _handleClick(id, index) {
    // this.props.navigation.navigate('Chat', { roomId: id, roomIndex: index });
    this.props.navigation.navigate('Chat');
    roomStore.roomId = id;    
    roomStore.roomIndex = index;
  }

  _renderItem = (item, i) => {
    return <Observer>{() =>
      <ListItem avatar key={i} button={true} onPress={() => this._handleClick(item.id, i)}>
        <Left>
          <Thumbnail source={{
            uri: item.users[0].images.length !== 0 ? config.apiHost + item.users[0].images[0].thumbnail : config.defaultUserImg
          }} />
        </Left>
        <Body>
          <Text>{(item.users && item.users[0]) ? item.users[0].name : ''}</Text>
          <Text numberOfLines={2} ellipsizeMode='tail' style={styles.introBox} style={{ height: 34 }} note>{item.lastMsg}</Text>
        </Body>
        <Right>
          <Text note>3:43 pm</Text>
        </Right>
      </ListItem>}
    </Observer>;
  };

  _getData = async () => {
    if (this.state.totalDocs >= roomStore.list.length) {
      let res = await roomStore.getRooms(this.state.limit, this.state.offset);
      this.setState({
        offset: res.offset + this.state.limit,
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
        data={roomStore.list}
        renderItem={({ item, index }) => this._renderItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this._handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshing={this.state.refreshing}
        onRefresh={this._handleRefresh}
        extraData={[this.state, this.props]}
      />
    );
  }
}

LinkScreen.navigationOptions = {
  title: 'Chat',
};

const styles = StyleSheet.create({
  introBox: {
    height: 34
  }
});
