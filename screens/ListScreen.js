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
import BadgeIcon from '../components/Badge';
import { dateConvert } from '../components/Util';
import config from '../constants/Config';
import roomStore from './../stores/RoomStore';
import authStore from './../stores/AuthStore';

@observer
export default class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      data: [],
      totalDocs: 0,
      page: 1,
      limit: 10,
      hasNextPage: true
    }
  }

  _handleRefresh = () => {
    roomStore.list = [];
    this.setState({
      refreshing: true,
      page: 1,
      hasNextPage: true
    }, this._getData);
  }

  _handleClick(id, index, name, userId, count) {
    roomStore.setValue(id, index, name, userId, count);
    authStore.me.tabBadgeCount -= count;
    this.props.navigation.navigate('Chat');
  }

  _renderItem = (item, i) => {
    return <Observer>{() =>
      <ListItem avatar key={i} button={true} onPress={() => this._handleClick(item._id, i, item.user.name, item.user._id, item.count)}>
        <Left>
          <Thumbnail source={{
            uri: item.user.images.length !== 0 ? config.apiHost + item.user.images[0].thumbnail : config.defaultUserImg
          }} />
        </Left>
        <Body>
          <Text>{(item.user && item.user) ? item.user.name : ''}</Text>
          <Text numberOfLines={2} ellipsizeMode='tail' style={styles.introBox} style={{ height: 34 }} note>{item.lastMsg}</Text>
        </Body>
        <Right>
          <Text note>{dateConvert(item.updatedAt)}</Text>
          <Text note></Text>
          <BadgeIcon num={item.count} />
        </Right>
      </ListItem>}
    </Observer>;
  };

  _getData = async () => {
    if (this.state.hasNextPage) {
      let res = await roomStore.getRooms(this.state.limit, this.state.page);
      this.setState({
        page: res.page + 1,
        totalDocs: res.totalDocs,
        refreshing: false,
        hasNextPage: res.hasNextPage
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

ListScreen.navigationOptions = {
  title: 'Chat',
  // header: null,
};

const styles = StyleSheet.create({
  introBox: {
    height: 34
  }
});
