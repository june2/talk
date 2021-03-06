import React, { Component } from 'react';
import {
  AppState,
  Platform,
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import {
  ListItem, Left, Body, Right,
  Thumbnail, Text
} from 'native-base';
import { observer, Observer } from 'mobx-react';
import { dateConvert } from '../components/Util';
import config from '../constants/Config';
import BadgeIcon from '../components/Badge';
import Admob from '../components/Admob';
import Notification from '../components/Notification';
import userStore from '../stores/UserStore';
import roomStore from '../stores/RoomStore';
import authStore from '../stores/AuthStore';
import Colors from '../constants/Colors';

@observer
export default class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
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

  _handleClick(id, index, count, user, lefts) {
    if (lefts && lefts.length > 0) {
      return Alert.alert(
        '상대가 방을 나갔습니다.',
        '',
        [
          { text: '확인', style: 'cancel', },
        ],
        { cancelable: false }
      );
    }
    if (user && user.state === 'LEAVE') {
      return Alert.alert(
        '상대가 계정을 탈퇴했습니다.',
        '',
        [
          { text: '확인', style: 'cancel', },
        ],
        { cancelable: false }
      );
    }
    let name = (user) ? user.name : '';
    let userId = (user) ? user._id : '';
    roomStore.setValue(id, index, name, userId, count);
    userStore.setUser(user, true);
    authStore.me.tabBadgeCount -= count;
    this.props.navigation.navigate('Chat');
  }

  _openModal(user) {
    userStore.setUser(user, true);
    this.setState({ userId: user.id });    
    this.props.navigation.navigate('User');
  }

  _renderItem = (item, i) => {
    return <Observer>{() =>
      <ListItem avatar key={i} button={true} >
        <Left style={{ paddingTop: 10 }}>
          {(item.user) ?
            <TouchableOpacity key={item.id} onPress={() => this._openModal(item.user)}>
              {(item.user.images && item.user.images.length !== 0) ?
                <Thumbnail style={styles.image} source={{ uri: item.user.images[0] }}
                  defaultSource={config.defaultUserImg(item.user.gender)} /> :
                <Thumbnail style={styles.defaultUserImg} source={config.defaultUserImg(item.user.gender)} />
              }
            </TouchableOpacity> : null
          }
        </Left>
        <Body>
          <TouchableOpacity key={item.id} onPress={() => this._handleClick(item._id, i, item.count, item.user, item.lefts)}>
            <Text numberOfLines={1} ellipsizeMode='tail'>{(item.user && item.user.name) ? item.user.name : ''}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.introBox} style={{ height: 34 }} note>{item.lastMsg}</Text>
          </TouchableOpacity>
        </Body>
        <Right>
          <TouchableOpacity style={styles.listRight} key={item.id} onPress={() => this._handleClick(item._id, i, item.count, item.user, item.lefts)}>
            <Text note>{dateConvert(item.updatedAt)}</Text>
            <View style={{ paddingTop: 4, width: 30 }}>
              <BadgeIcon num={item.count} />
            </View>
          </TouchableOpacity>
        </Right>
      </ListItem>}
    </Observer>;
  };

  _getData = async () => {
    if (this.state.hasNextPage) {
      let res = await roomStore.getRooms(this.state.page, this.state.limit);
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

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/active/) && nextAppState === 'active') {
      this._handleRefresh();
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    this._getData();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return (
      <View style={styles.container} >
        <Notification />
        <Admob />
        {(roomStore.isEmpty) ? (
          <ListItem key={1} button={true} style={styles.empty}>
            <Body>
              <Text>진행 중인 채팅 내역이 없습니다.</Text>
              <Text>마음에 드는 사람에게 메시지를 보내보세요!</Text>
            </Body>
          </ListItem>
        ) : (
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
              style={styles.list}
            />
          )}
      </View>
    );
  }
}

if (Platform.OS === 'android') {
  ListScreen.navigationOptions = {    
    header: null,
  };
} else {
  ListScreen.navigationOptions = {
    headerTitle: (
      <Image style={{ width: 30, height: 30 }} source={require('./../assets/images/header.png')} />
    ),
  };
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1
  },
  image: {
    backgroundColor: "#ccc",
    overflow: "hidden",
    resizeMode: Platform.select({
      ios: 'contain',
      android: 'cover',
    }),
  },
  defaultUserImg: {
    backgroundColor: Colors.tabIconDefault,
    resizeMode: Platform.select({
      ios: 'contain',
      android: 'cover',
    }),
  },
  list: {
    flex: 1
  },
  empty: {
  },
  listRight: {
    alignItems: 'flex-end'
  }
});
