import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View, Text,
  Animated
} from 'react-native';
import { observer } from 'mobx-react';
import notificationStore from '../stores/NotificationStore';
import Colors from '../constants/Colors';

@observer
export default class Notification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };    
  }

  render() {
    return (
      <Animated.View style={{
        opacity: notificationStore.opacity,
        ...styles.container
      }}>
        <View style={styles.box}>
          <Text style={styles.boxText}>{notificationStore.text}</Text>
        </View>
      </Animated.View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    zIndex: 3,
    fontSize: 12,
    width: '100%',
    alignItems: 'center'
  },
  box: {
    flex: 1,
    width: '70%',
    marginBottom: 10,
    borderRadius: 50,
  },
  boxText: {
    backgroundColor: Colors.tintColor,
    color: '#fff',
    padding: 5,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
