import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View, Text,
  Image
} from 'react-native';
import {
  ListItem, Left, Body, Right,
  Thumbnail,
  Icon
} from 'native-base';
import config from '../constants/Config';
import { getLocation } from '../constants/Items';
import { getAge } from './../components/Util';
import { observer } from 'mobx-react';
import userStore from '../stores/UserStore';

let id = 0;

@observer
export default class UserItem extends PureComponent {
  constructor(props) {
    super(props);
    this._id = id++;
  }

  _handleClick(user) {
    userStore.setUser(user, false);
    this.setState({ userId: user.id });
    this.props.navigation.navigate('User');
  }

  render() {
    return (
      <ListItem avatar key={this._id} button={true} onPress={() => this._handleClick(this.props.user)} >
        <Left>
          <Thumbnail
            source={{
              uri: (this.props.user && this.props.user.images.length !== 0) ? this.props.user.images[0] : config.defaultUserImg
            }} />
        </Left>
        <Body>
          <Text>{this.props.user.name}</Text>
          <Text numberOfLines={2} ellipsizeMode='tail' style={styles.introBox} note>{this.props.user.intro}{"\n"}</Text>
        </Body>
        <Right>
          <Text note>
            <Icon active name={
              this.props.user.gender === 'M' ? 'md-female' : 'md-male'
            } style={{
              ...styles.containerGenderIcon,
              color: this.props.user.gender === 'M' ? '#007aff' : 'red',
            }} />
          </Text>
          <Text note>{getAge(this.props.user.birthday)}</Text>
          <Text note>{getLocation(this.props.user.location)}</Text>
        </Right>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  introBox: {
    height: 34
  },
  containerGenderIcon: {
    fontSize: 12,
  },
});
