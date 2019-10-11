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
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  _handleClick() {
    // this.props.navigation.navigate('Chat')
  }

  render() {
    return (
      <View>
        <Image
          source={{ uri: 'https://yt3.ggpht.com/a/AGF-l78bW3omuJwQGhPI_sM8JrnwV-0ATQ4ctPiPrQ=s88-mo-c-c0xffffffff-rj-k-no' }}
          style={styles.containerImg}
        />
        <Grid style={styles.containerButtonBox}>
          <Col>
            <Button block transparent style={styles.containerButton}>
              <Icon active name='ios-heart' style={styles.containerIcon} />
            </Button>
          </Col>
          <Col >
            <Button block transparent style={styles.containerButton}>
              <Icon active name='ios-chatboxes' style={styles.containerIcon} />
            </Button>
          </Col>
          <Col >
            <Button block transparent style={styles.containerButton}>
              <Icon active name='md-information' style={styles.containerIcon} />
            </Button>
          </Col>
        </Grid>
        <Body style={styles.container}>
          <Text style={styles.containerTextTitle}>ABOUT ME</Text>
          <Text style={styles.containerText}>This is just a transparent card with some text to boot.
            test test test</Text>
        </Body>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 304,
    top: 476,
    flex: 1,
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
    borderRadius: 12,
  },
  containerImg: {
    flex: 1,
    width: '100%',
    height: 380,
    // resizeMode: 'contain'
  },
  containerButtonBox: {
    alignItems: 'center',
  },
  containerButton: {
    height: 100
  },
  containerIcon: {
    fontSize: 40,
    color: 'red',
  },
  containerTextTitle: {
    top: 10,
    padding: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 25,
    color: '#000',
  },
  containerText: {
    padding: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 15,
    lineHeight: 25,
    color: '#444444',
  },
});
