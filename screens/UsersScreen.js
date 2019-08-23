import React, { Component } from 'react';
import {
  FlatList,
  Modal, View, Alert,
  StyleSheet,
} from 'react-native';
import {
  ListItem, Left, Body, Right,
  Thumbnail, Text
} from 'native-base';
import { observer } from 'mobx-react';
import config from '../constants/Config';
import userStore from '../stores/UserStore';
import roomStore from '../stores/RoomStore';
import UserBox from '../components/UserBox';

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
      limit: 10
    }
  }

  _handleRefresh = () => {
    this.setState({
      refreshing: true,
      offset: 0,
    }, this._getData);
  }

  _handleClick(user) {
    userStore.setUser(user);
    this.setState({ userId: user.id });
    this.setModalVisible(true);
  }

  _renderItem = ({ item }, i) => (
    <ListItem avatar key={i} button={true} onPress={() => this._handleClick(item)} >
      <Left>
        <Thumbnail source={{
          uri: item.images.length !== 0 ? config.apiHost + item.images[0].thumbnail : config.defaultUserImg
        }} />
      </Left>
      <Body>
        <Text>{item.name}</Text>
        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.introBox} note>{item.intro}{"\n"}</Text>
      </Body>
      <Right>
        <Text note>3:43 pm</Text>
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
    //TODO: check : point
    await roomStore.createRoom(this.state.userId, msg);
    roomStore.getRooms(10, 0);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <View >
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ flex: 1, }}>
            <UserBox closeModal={(visible) => this.setModalVisible(visible)} sendMsg={(msg) => this.sendMsg(msg)} />
          </View>
        </Modal>

        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={this.state.refreshing}
          onRefresh={this._handleRefresh}
        />
      </View>
    );
  }
}

UsersScreen.navigationOptions = {
  title: 'USERS',
};

const styles = StyleSheet.create({
  introBox: {
    height: 34
  }
});