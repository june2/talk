import React, { Component } from 'react';
import {
  Platform,
  View,
  ScrollView,
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
    this.state = {}
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <Notification />
          <View style={styles.containerImgBox}>
            <Carousel images={authStore.me.images} isMe={true} />
          </View>
          <View style={styles.containerTitleBox}>
            <Grid>
              <Col style={styles.containerTitle}>
                <Text style={styles.containerTitleBoxName} numberOfLines={1} ellipsizeMode='tail'>
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
                <Button rounded style={styles.containerButton} onPress={() => this.props.navigation.navigate('MyUpdate')}>
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
        </View>
      </ScrollView >
    );
  }
}

// if (Platform.OS === 'android') {
MyScreen.navigationOptions = {
  title: '',
  header: null,
};
// }

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height + 50
  },
  topBox: {
    backgroundColor: '#ccc',
    height: 50
  },
  containerImgBox: {
    // flex: 2,
    height: height * 0.7
  },
  containerImgTitle: {
    color: '#fff',
    fontSize: 30,
  },
  containerTitleBox: {
    flexDirection: 'row',
    height: 70
  },
  containerTitle: {
    paddingTop: 3
  },
  containerTitleBoxName: {
    width: width - 90,
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
    fontSize: 35,
    width: '100%',
    textAlign: 'center',    
    // color: color.tintColor,
  },
  containerButton: {
    justifyContent: 'center',    
    width: 55,
    height: 55,
    backgroundColor: Colors.tintColor,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.6,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
  },
  containerTextBox: {
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
