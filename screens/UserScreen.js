import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { Text, Button, Icon, ActionSheet } from 'native-base';
import { observer } from 'mobx-react';
import userStore from './../stores/UserStore';
import { getLocation } from './../constants/Items';
import { getAge } from './../components/Util';
import Carousel from '../components/Carousel';
import MessageBox from '../components/MessageBox';
import ReportBox from '../components/ReportBox';
import Colors from './../constants/Colors'
import { window } from '../constants/Layout';

@observer
export default class UserScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: userStore.user.name,
      navigatorStyle: {
        navBarHidden: false,
      },
      headerLeft: (
        <Icon name='md-arrow-round-back'
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: 'rgba(0, 0, 0, .9)',
            marginHorizontal: 16,
            textAlign: 'center',
          }}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: (
        <Icon name='ios-menu'
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: 'rgba(0, 0, 0, .9)',
            marginHorizontal: 16,
            textAlign: 'center',
          }}
          onPress={() =>
            ActionSheet.show(
              {
                options: [
                  { text: "신고하기" },
                  { text: "차단하기" },
                  { text: "취소" }
                ],
                cancelButtonIndex: 2,
              },
              buttonIndex => {
                switch (buttonIndex) {
                  case 0:
                    userStore.setReportBox(true);
                    break;
                  case 1:
                    userStore.blockUser();
                    navigation.goBack();
                    break;
                  default:
                    break;
                }
              }
            )}
        />
      ),
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      isSent: false,
      screenHeight: window.height
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <ReportBox />
          <MessageBox navigation={this.props.navigation} />
          <View style={styles.containerImgBox}>
            <Carousel images={userStore.user.images} isMe={false} navigation={this.props.navigation} />
          </View>
          <View style={styles.containerTitleBox}>
            <Grid>
              <Col style={styles.containerTitle}>
                <Text style={styles.containerTitleBoxName} numberOfLines={1} ellipsizeMode='tail'>
                  {userStore.user.name}
                </Text>
                <Text style={styles.containerTitleBoxLocation}>
                  <Icon active name={
                    userStore.user.gender === 'M' ? 'md-female' : 'md-male'
                  } style={{
                    ...styles.containerGenderIcon,
                    color: userStore.user.gender === 'M' ? '#007aff' : 'red',
                  }} />&nbsp;&nbsp;&nbsp;
                {getAge(userStore.user.birthday)}&nbsp;&nbsp;&nbsp;
                {getLocation(userStore.user.location)}
                </Text>
              </Col>
              {(!userStore.isChat) ?
                <Col style={styles.containerTitleBoxButton}>
                  <Button rounded style={styles.containerButton} onPress={() => userStore.setMsgBox(true)}>
                    <Icon active name='ios-chatbubbles' style={styles.containerTitleBoxButtonIcon} />
                  </Button>
                </Col> : null}
            </Grid>
          </View>
          <View style={styles.containerTextBox}>
            <Text style={styles.containerText}>
              {userStore.user.intro}
            </Text>
          </View>
        </View >
      </ScrollView>
    );
  }
}

if (Platform.OS === 'android') {
  UserScreen.navigationOptions = {
    title: '',
    header: null,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: window.height + 50
  },
  containerCloseBox: {
    right: 30,
    top: 50,
    position: 'absolute',
  },
  containerCloseBoxButton: {
    color: '#fff',
    fontSize: 30,
  },
  containerImgBox: {
    // flex: 2,
    height: window.height * 0.7
  },
  containerImgTitle: {
    color: '#fff',
    fontSize: 30,
  },
  containerTitleBox: {
    flexDirection: 'row',
    height: 70,
  },
  containerTitle: {
    paddingTop: 3
  },
  containerTitleBoxName: {
    width: window.width - 90,
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
    // color: Colors.tintColor,
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
  containerIcon: {
    fontSize: 40,
    color: 'red',
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
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: window.height * 0.2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerTransparentStyle: {
    backgroundColor: '#fff',
    width: '80%'
  },
  modalView: {
    flex: 1,
    marginTop: 30,
    marginBottom: 30,
    justifyContent: 'center',
  },
  modalText: {
    // borderWidth: 1,
    // borderColor: 'red',    
    top: 10,
    padding: 10,
    width: '100%'
  },
  modalButtonBox: {
    padding: 10,
    width: '50%',
  },
  modalButton: {
    backgroundColor: Colors.tintColor
  }
});
