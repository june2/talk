import React, { Component } from 'react';
import {
  Modal, TouchableHighlight,
  View, Alert,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { observer } from 'mobx-react';
import userStore from './../stores/UserStore';

@observer
export default class MyScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerImgBox}>
          <Image
            source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }}
            style={styles.containerImg}
          />
        </View>
        <View style={styles.containerButtonBox}>
          <View style={styles.containerButton}>
            <Button block title="update" onPress={() => this.props.navigation.navigate('MyUpdate')} style={styles.formBoxButton}>
              <Text>프로필 수정</Text>
            </Button>
          </View>
        </View>
        <View style={styles.containerTextBox}>
          <Text style={styles.containerTextTitle}>ABOUT ME</Text>
          <Text style={styles.containerText}>
            This is just a transparent card with some text to boot.
              test test test
          </Text>
        </View>
      </View >
    );
  }
}

MyScreen.navigationOptions = {
  // header: null,
  title: 'My page'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImgBox: {
    flex: 2,
  },
  containerImg: {
    flex: 1,
    width: '100%',
  },
  containerButtonBox: {
    flexDirection: 'row',
    flex: 0.5,
  },
  containerButton: {
    flex: 1,
  },
  containerIcon: {
    fontSize: 40,
    color: 'red',
  },
  containerTextBox: {
    flex: 1,
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 12,
    marginLeft: 20,
    marginRight: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  containerTextTitle: {
    top: 10,
    padding: 18,
    flex: 0,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 25,
    color: '#000',
    alignItems: 'center',
  },
  containerText: {
    padding: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 15,
    lineHeight: 25,
    color: '#444444',
  },
  formBoxButton: {
    margin: 30
  },
});
