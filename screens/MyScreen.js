import React, { Component } from 'react';
import {
  View, Alert,
  StyleSheet,
  Platform
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Text, Button, Icon, Left, Body, Right } from 'native-base';
import Slideshow from 'react-native-image-slider-show';
import { observer } from 'mobx-react';
import authStore from './../stores/AuthStore';

@observer
export default class MyScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerImgBox}>
          <Slideshow
            height={450}
            containerStyle={styles.containerImg}
            dataSource={authStore.slider} />
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
            {authStore.me.intro}
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
