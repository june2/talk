import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Textarea, Text, Button, Icon, } from 'native-base';
import { observer } from 'mobx-react';
import reportStore from './../stores/ReportStore';

@observer
export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      screenHeight: Math.round(Dimensions.get('window').height)
    }
  }

  _report() {
    //TODO:
    reportStore.createReport();
    this.props.closeModal(false);
  }

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContainerTransparentStyle}>
          <Textarea rowSpan={5} placeholder="신고 사유를 작성해주세요!" style={styles.modalButton} onChangeText={(text) => this.setState({ text })} />
          <Grid>
            <Col style={styles.modalButton}>
              <Button block title="report" onPress={() => this._report()} >
                <Text>신고하기</Text>
              </Button>
            </Col>
            <Col style={styles.modalButton}>
              <Button block title="Login" onPress={() => this.props.closeModal(false)} >
                <Text>취소</Text>
              </Button>
            </Col>
          </Grid>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: Math.round(Dimensions.get('window').height) * 0.3,
    backgroundColor: '#ecf0f1',
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
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 28,
  },
  modalButton: {
    padding: 10,
  }
});
