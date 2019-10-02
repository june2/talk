import React, { Component } from 'react';
import {
  View, Alert,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { Text, Thumbnail, Button, Icon, Left, Right, ListItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Slideshow from 'react-native-image-slider-show';
import { observer } from 'mobx-react';
import authStore from './../stores/AuthStore';
import { getAge } from './../components/Util';

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
        <View style={styles.containerImgBox}>
          <Slideshow
            height={this.state.screenHeight / 1.5}
            titleStyle={styles.containerImgTitle}
            containerStyle={styles.containerImg}
            dataSource={authStore.slider} />
        </View>
        <View style={styles.containerTitleBox}>
          <Grid>
            <Col>
              <Text style={styles.containerTitleBoxName}>{authStore.me.name}</Text>
              <Text style={styles.containerTitleBoxLocation}>
                {getAge(authStore.me.birthday)}   {authStore.me.location}
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

MyScreen.navigationOptions = {
  title: 'My page',
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImgBox: {
    flex: 3.5,
  },
  containerImg: {
    flex: 1,
    width: '100%',
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
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  containerTitleBoxButtonIcon: {
    fontSize: 40,
    color: '#007aff',
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
    marginLeft: 15,
    marginRight: 15,
  },
  containerText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'rgb(178, 181, 182)',
  },  
});
