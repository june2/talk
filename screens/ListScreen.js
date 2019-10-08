import React, { Component } from 'react';
import {
  FlatList,
  Modal, View, Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  ListItem, Left, Body, Right,
  Thumbnail, Text
} from 'native-base';
// import UserBox from '../components/UserBox';
import { observer, Observer } from 'mobx-react';
import BadgeIcon from '../components/Badge';
import { dateConvert } from '../components/Util';
import config from '../constants/Config';
import userStore from '../stores/UserStore';
import roomStore from './../stores/RoomStore';
import authStore from './../stores/AuthStore';

@observer
export default class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      modalVisible: false,
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

  _openModal(user) {
    userStore.setUser(user, true);
    this.setState({ userId: user.id });
    // this.setModalVisible(true);
    this.props.navigation.navigate('User');
  }

  _renderItem = (item, i) => {
    return <Observer>{() =>
      <ListItem avatar key={i} button={true} >
        <Left>
          <TouchableOpacity key={item.id} onPress={() => this._openModal(item.user)}>
            <Thumbnail
              source={{
                uri: (item.user && item.user.images.length !== 0) ? item.user.images[0] : config.defaultUserImg
              }} />
          </TouchableOpacity>
        </Left>
        <Body>
          <TouchableOpacity key={item.id} onPress={() => this._handleClick(item._id, i, item.user.name, item.user._id, item.count)}>
            <Text>{(item.user && item.user) ? item.user.name : ''}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.introBox} style={{ height: 34 }} note>{item.lastMsg}</Text>
          </TouchableOpacity>
        </Body>
        <Right>
          <TouchableOpacity key={item.id} onPress={() => this._handleClick(item._id, i, item.user.name, item.user._id, item.count)}>
            <Text note>{dateConvert(item.updatedAt)}</Text>
            <Text note></Text>
            <BadgeIcon num={item.count} />
          </TouchableOpacity>
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

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <View style={styles.container} >
        {/* <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ flex: 1 }}>
            <UserBox closeModal={(visible) => this.setModalVisible(visible)} sendMsg={(msg) => this.sendMsg(msg)} />
          </View>
        </Modal> */}
        <ListItem key={1} button={true} style={{
          display: (roomStore.isEmpty) ? 'flex' : 'none'
        }}>
          <Body>
            <Text>진행 중인 채팅 내역이 없습니다.</Text>
            <Text>마음에 드는 사람에게 메시지를 보내보세요!</Text>
          </Body>
        </ListItem>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={5}
          windowSize={10}
          // removeClippedSubviews={true}
          legacyImplementation={true}
          data={roomStore.list}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.01}
          refreshing={this.state.refreshing}
          onRefresh={this._handleRefresh}
          extraData={[this.state, this.props]}
          style={styles.flatList}
        />
      </View>
    );
  }
}

ListScreen.navigationOptions = {
  // title: 'Chat',
  // header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  introBox: {
    height: 34
  },
  flatList: {
    flexGrow: 1,
  }
});
