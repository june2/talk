import React, { Component } from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text, Button, Icon, } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { observer } from 'mobx-react';
import authStore from './../stores/AuthStore';
import { getLocation } from './../constants/Items';
import { getAge } from './../components/Util';
import Notification from '../components/Notification';
import Carousel from '../components/Carousel';
import color from './../constants/Colors'
import Colors from './../constants/Colors';

@observer
export default class MyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: Math.round(Dimensions.get('window').height)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Notification />
        {/* <View style={styles.topBox}></View> */}
        <View style={styles.containerImgBox}>
          <Carousel images={authStore.me.images} isMe={true} />
        </View>
        <View style={styles.containerTitleBox}>
          <Grid>
            <Col>
              <Text style={styles.containerTitleBoxName}>
                {authStore.me.name}
              </Text>
              <Text style={styles.containerTitleBoxLocation}>
                <Icon active name={
                  authStore.me.gender === 'M' ? 'md-female' : 'md-male'
                } style={{
                  ...styles.containerGenderIcon,
                  color: authStore.me.gender === 'M' ? '#007aff' : 'red',
                }} />&nbsp;&nbsp;&nbsp;
                {getAge(authStore.me.birthday)}&nbsp;&nbsp;&nbsp;
                {getLocation(authStore.me.location)}
              </Text>
            </Col>
            <Col style={styles.containerTitleBoxButton}>
              <Button block transparent style={{ height: 55 }} onPress={() => this.props.navigation.navigate('MyUpdate')}>
                <Icon active name='md-create' style={styles.containerTitleBoxButtonIcon} />
              </Button>
            </Col>
          </Grid>
        </View>
        <View style={styles.containerTextBox}>
          <Text style={styles.containerText}>
            {authStore.me.intro}
          </Text>
        </View>
      </View >
    );
  }
}

if (Platform.OS === 'android') {
  MyScreen.navigationOptions = {
    title: '',
    header: null,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBox: {
    backgroundColor: '#ccc',
    height: 50
  },
  containerImgBox: {
    flex: 3,
  },
  containerImgTitle: {
    color: '#fff',
    fontSize: 30,
  },
  containerTitleBox: {
    flexDirection: 'row',
    flex: 0.5,
  },
  containerTitleBoxName: {
    marginTop: 15,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 25
  },
  containerTitleBoxLocation: {
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'rgb(178, 181, 182)'
  },
  containerTitleBoxButton: {
    marginTop: 10,
    marginRight: 10,
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  containerGenderIcon: {
    marginLeft: 15,
    fontSize: 12,
  },
  containerTitleBoxButtonIcon: {
    fontSize: 40,
    color: color.tintColor,
  },
  containerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerIcon: {
    fontSize: 40,
    color: 'red',
  },
  containerTextBox: {
    flex: 1,
    marginTop: -20,
    marginLeft: 15,
    marginRight: 15,
  },
  containerText: {
    paddingTop: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'rgb(178, 181, 182)',
  },
});
