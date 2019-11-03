import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
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
import Colors from '../constants/Colors';

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
      <ListItem style={{ height: 65 }} avatar key={this._id} button={true} onPress={() => this._handleClick(this.props.user)} >
        <Left style={styles.itemLeft}>
          {(this.props.user && this.props.user.images && this.props.user.images.length !== 0) ?
            <Thumbnail source={{ uri: this.props.user.images[0] }} /> :
            <Thumbnail style={styles.image} source={config.defaultUserImg(this.props.user.gender)} style={styles.defaultUserImg} />
          }
        </Left>
        <Body style={{ height: 65 }}>
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
          <Text style={styles.introBox}>{getLocation(this.props.user.location)}</Text>
        </Right>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
  },
  itemLeft: {
    paddingTop: 4
  },
  itemRight: {
    // paddingBottom: 0
  },
  defaultUserImg: {
    backgroundColor: Colors.tabIconDefault
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
