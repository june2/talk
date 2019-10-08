import React, { Component } from 'react';
import { AdMobBanner } from 'expo-ads-admob'
import {
  FlatList,
  View, Alert,
  StyleSheet,
} from 'react-native';
// import Modal from "react-native-modal";
// import Modal from "react-native-modalbox";
import {
  ListItem, Left, Body, Right,
  Thumbnail, Text, Grid, Icon
} from 'native-base';
import { observer } from 'mobx-react';
import { getLocation } from '../constants/Items';
import { getAge } from './../components/Util';
import config from '../constants/Config';
import UserBox from '../components/UserBox';
import userStore from '../stores/UserStore';
import roomStore from '../stores/RoomStore';

@observer
export default class UsersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      modalVisible: false,
      refreshing: false,
      data: [],
      totalDocs: 0,
      offset: 0,
      limit: 30
    }
  }

  _handleRefresh = () => {
    this.setState({
      refreshing: true,
      offset: 0,
    }, this._getData);
  }

  _handleClick(user) {
    userStore.setUser(user, false);
    this.setState({ userId: user.id });
    // this.setModalVisible(true);
    this.props.navigation.navigate('User');
  }

  _renderItem = ({ item }, i) => (
    <ListItem avatar key={i} button={true} onPress={() => this._handleClick(item)} >
      <Left>
        <Thumbnail source={{
          uri: (item.images && item.images.length !== 0) ? item.images[0] : config.defaultUserImg
        }} />
      </Left>
      <Body>
        <Text>{item.name}</Text>
        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.introBox} note>{item.intro}{"\n"}</Text>
      </Body>
      <Right>
        <Text note>
          <Icon active name={
            item.gender === 'M' ? 'md-female' : 'md-male'
          } style={{
            ...styles.containerGenderIcon,
            color: item.gender === 'M' ? '#007aff' : 'red',
          }} />
        </Text>
        <Text note>{getAge(item.birthday)}</Text>
        <Text note>{getLocation(item.location)}</Text>
      </Right>
    </ListItem>
  );

  _getData = async () => {
    if (this.state.totalDocs >= this.state.data.length) {
      let res = await userStore.getUsers(this.state.limit, this.state.offset);
      let data = res.docs;
      this.setState({
        data: this.state.refreshing ? data : this.state.data.concat(data),
        offset: res.offset + this.state.limit,
        totalDocs: res.totalDocs,
        refreshing: false
      })
    }
  }

  _handleLoadMore = () => {
    this._getData();
  }

  sendMsg = async (msg) => {
    await roomStore.createRoom(this.state.userId, msg);
    roomStore.getRooms();
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
        <View>
          <AdMobBanner
            style={styles.bottomBanner}
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            // Test ID, Replace with your-admob-unit-id
            testDeviceID="EMULATOR"
            onDidFailToReceiveAdWithError={(err) => console.log(err)}
            onAdMobDispatchAppEvent={(evt) => console.log(evt)}
          />
        </View>
        {/* <Modal
          isVisible={this.state.modalVisible}
          onSwipeComplete={(obj) => {
            if (obj.swipingDirection === 'down') return this.setModalVisible(false);
          }}
          scrollHorizontal={true}
          swipeDirection={['down']}
          // swipeDirection={['right', 'left', 'down']}
          // useNativeDriver={true}
          style={{
            flex: 1,
            margin: 0
          }}
        > */}
        {/* <Modal          
          coverScreen={true}
          swipeToClose={true}
          // swipeArea={1} // The height in pixels of the swipeable area, window height by default
          swipeThreshold={10} // The threshold to reach in pixels to close the modal
          isOpen={this.state.modalVisible}
          onClosed={() => this.setModalVisible(false)}          
          useNativeDriver={false}
        >
          <View style={{ flex: 1 }}>
            <UserBox closeModal={(visible) => this.setModalVisible(visible)} sendMsg={(msg) => this.sendMsg(msg)} />
          </View>
        </Modal> */}
        <View style={{ paddingBottom: 60 }}>
          <FlatList
            keyExtractor={item => item.id}
            initialNumToRender={5}
            windowSize={10}
            removeClippedSubviews={true}
            legacyImplementation={true}
            data={this.state.data}
            renderItem={this._renderItem}
            onEndReached={this._handleLoadMore}
            onEndReachedThreshold={0.05}
            refreshing={this.state.refreshing}
            onRefresh={this._handleRefresh}
            style={styles.flatList}
          />
        </View>
      </View>
    );
  }
}

UsersScreen.navigationOptions = {
  // title: 'USERS',
  // header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  introBox: {
    height: 34
  },
  bottomBanner: {
    position: "absolute",
    top: 0,
    zIndex: 2,
  },
  containerGenderIcon: {
    fontSize: 12,
  },
  flatList: {
    flexGrow: 1,
    top: 60,
  }
});