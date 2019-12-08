import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Button, Icon } from 'native-base';
import { observer } from 'mobx-react';
import Colors from '../constants/Colors';
import filterStore from '../stores/FilterStore';

@observer
export default class Notification extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button rounded style={styles.button} onPress={() => filterStore.setMsgBox(true)}>
          <Icon name='md-funnel' style={styles.icon} />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 4,
    fontSize: 12,
    width: 50,
  },
  button: {
    width: 55,
    height: 55,
    backgroundColor: Colors.tintColor,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.6,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {        
    zIndex: 5,
    fontSize: 23,
    color: Colors.noticeText,
  }
});
