import React, { Component } from "react";
import { Text, View, Image, TouchableHighlight } from "react-native";
import { Icon } from 'native-base';
import { observer } from 'mobx-react';
import { getLocation } from '../constants/Items';
import { getAge } from './Util';
import config from '../constants/Config';
import userStore from '../stores/UserStore';

@observer
export default class UserItem extends Component {
  _handleClick(user) {    
    userStore.setUser(user, false);
    this.setState({ userId: user.id });
    this.props.navigation.navigate('User');
  }

  render() {
    return (
      <TouchableHighlight
        style={styles.touchLine}
        underlayColor="#d3d3d3"
        onPress={() => this._handleClick(this.props.user)}>
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <View style={styles.imageBox}>
              {(this.props.user && this.props.user.images && this.props.user.images.length !== 0) ?
                <Image style={styles.image} source={{ uri: this.props.user.images[0] }} /> :
                <Image style={styles.image} source={config.defaultUserImg(this.props.user.gender)} />
              }
            </View>
            <View style={styles.infoBox}>
              <View>
                <Text>
                  <Icon active name={
                    this.props.user.gender === 'M' ? 'md-female' : 'md-male'
                  } style={{
                    ...styles.genderIcon,
                    color: this.props.user.gender === 'M' ? '#007aff' : 'red',
                  }} />
                </Text>
                <View></View>
                <Text style={styles.lightText}>{getAge(this.props.user.birthday)}</Text>
                <View></View>
                <Text style={styles.lightText}>{getLocation(this.props.user.location)}</Text>
              </View>
            </View>
            <View style={styles.introBox}>
              <View>
                <Text>{this.props.user.name}</Text>
                <View></View>
                <Text style={styles.lightText} numberOfLines={1} ellipsizeMode='tail' note>{this.props.user.intro}{"\n"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.line}></View>
        </View>
      </TouchableHighlight >
    );
  }
}
const styles = {
  touchLine: {
    backgroundColor: "#d3d3d3",
    elevation: 1,
    height: 65
  },
  outerContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: "white",
    alignItems: "center",
    padding: 16
  },
  image: {
    height: 50,
    width: 50,
    marginRight: 16,
    borderRadius: 50 / 2,
    overflow: "hidden",
    resizeMode: 'contain',
  },
  genderIcon: {
    fontSize: 12,
  },
  line: {
    height: 0.5,
    backgroundColor: "#d3d3d3"
  },
  imageBox: {
    width: 60,
  },
  infoBox: {
    width: 40,
  },
  introBox: {
    paddingTop: 4,
  },
  lightText: {
    fontSize: 12,
    color: '#878787'
  },
}