import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View, Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Card,
  CardItem,
  Left,
} from 'native-base';
import { observer } from 'mobx-react';
import RNPickerSelect from 'react-native-picker-select';
import { locations, filterGender, age } from '../constants/Items';
import Colors from '../constants/Colors';
import filterStore from '../stores/FilterStore';

@observer
export default class Notification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gender: filterStore.gender
    }
  }

  _ok = () => {
    filterStore.setMsgBox(false);    
    filterStore.gender = this.state.gender;
    this.props.setFilter();
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={filterStore.isVisible}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => filterStore.setMsgBox(false)}
        >
          <View style={styles.container}>
            <View style={styles.content}>
              <View>
                <Card style={styles.card}>
                  <CardItem style={styles.cardItem}>
                    <Left>
                      <Text style={styles.text}>성별</Text>
                    </Left>
                  </CardItem>
                  <CardItem style={styles.cardItemSecond}>
                    <Left>
                      <RNPickerSelect
                        placeholder={{}}
                        items={filterGender}
                        onValueChange={val => {
                          this.setState({ gender: val })
                        }}
                        InputAccessoryView={() => null}
                        style={pickerSelectStyles}
                        value={this.state.gender}
                      />
                    </Left>
                  </CardItem>
                </Card>

                <Button style={styles.button} block title="ok" onPress={() => this._ok()} >
                  <Text style={styles.textButton}>적용</Text>
                </Button>
              </View>
            </View>
          </View>
        </TouchableOpacity>

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
    height: 200
  },
  card: {
    flex: 0,
    margin: 0
    // padding: 15
  },
  cardItem: {
    flex: 0,
    // padding: 30,
    margin: 0
  },
  cardItemSecond: {
    flex: 0,
    marginTop: -10
  },
  button: {
    backgroundColor: Colors.tintColor,
  },
  text: {
    color: Colors.tabIconDefault
  },
  textButton: {
    color: Colors.noticeText
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    width: '100%'
  },
  inputAndroidContainer: {
    width: 2000
  },
  inputAndroid: {
    fontSize: 20,
    width: '100%'
  },
  viewContainer: {
    width: '100%'
  },
});
