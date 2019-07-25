import React, { Component } from 'react';
import {
  FlatList,
  Modal, TouchableHighlight, View, Alert
} from 'react-native';
import {
  ListItem, Left, Body, Right,
  Thumbnail, Text
} from 'native-base';
import { observer } from 'mobx-react';
import userStore from './../stores/UserStore';
import authStore from './../stores/AuthStore';
import UserBox from './../components/UserBox';

@observer
export default class LinkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refreshing: false,
      data: [],
      page: 1
    }
  }

  _handleRefresh = () => {
    this.setState({
      refreshing: true,
      page: 1,
    }, this._getData);
  }

  _handleClick() {
    this.setModalVisible(true);    
    // Alert.alert("I am clicked"); 
  }

  _renderItem = ({ item }, i) => (
    <ListItem avatar key={i} button={true} onPress={() => this._handleClick()}>
      <Left>
        <Thumbnail source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }} />
      </Left>
      <Body>
        <Text>{item.name}</Text>
        <Text note>Doing what you like will always keep you happy . .</Text>
      </Body>
      <Right>
        <Text note>3:43 pm</Text>
      </Right>
    </ListItem>
  );

  _getData = async () => {
    let data = await userStore.getUsers();
    this.setState({
      data: this.state.refreshing ? data : this.state.data.concat(data),
      page: this.state.page + 1,
      refreshing: false
    })
  }

  _handleLoadMore = () => {
    this._getData();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    this._getData();
    authStore.getMe();
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
          <View style={{ marginTop: 22 }}>            
            <UserBox closeModal={(visible) => this.setModalVisible(visible)} />
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

LinkScreen.navigationOptions = {
  title: 'Link',
};