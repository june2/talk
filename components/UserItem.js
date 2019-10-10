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
        <Left style={styles.itemLeft}>
          <Thumbnail
            source={{
              uri: (this.props.user && this.props.user.images && this.props.user.images.length !== 0) ? this.props.user.images[0] : config.defaultUserImg
            }} />
        </Left>
        <Body>
          <Text>{this.props.user.name}</Text>
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.introBox} note>{this.props.user.intro}{"\n"}</Text>
        </Body>
        <Right style={styles.itemRight}>
          <Text note>
            <Icon active name={
              this.props.user.gender === 'M' ? 'md-female' : 'md-male'
            } style={{
              ...styles.containerGenderIcon,
              color: this.props.user.gender === 'M' ? '#007aff' : 'red',
            }} />&nbsp;&nbsp;&nbsp;
            {getAge(this.props.user.birthday)}
          </Text>
          {/* <Text note>{getAge(this.props.user.birthday)}</Text> */}
          <Text style={styles.introBox}>{getLocation(this.props.user.location)}</Text>          
        </Right>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  itemLeft: {
    paddingTop: 10
  },
  itemRight: {
    paddingBottom: 0
  },
  text: {
    color: 'red'
  },
  introBox: {
    height: 34,
    fontSize: 12,
    lineHeight: 20,
    // fontWeight: '200',
    color: '#808080'
  },
  containerGenderIcon: {
    fontSize: 12,
  },
});
