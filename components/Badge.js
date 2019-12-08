import React from 'react';
import {
  Badge,
  Text
} from 'native-base';
import { Platform } from "react-native";

export default function BadgeIcon(props) {
  if (props && props.num && props.num != 0) {
    return (
      <Badge style={styles.badge}>
        <Text style={styles.text}>{props.num}</Text>
      </Badge>
    );
  } else {
    return null;
  }
}

const styles = {
  badge: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.select({ ios: 1 })
  },
  text: {
    fontSize: 12
  }
}