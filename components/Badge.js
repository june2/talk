import React from 'react';
import {
  Badge,
  Text
} from 'native-base';

export default function BadgeIcon(num) {
  return (
    <Badge style={{
      fontSize: 5,
      paddingTop: 1,
      paddingBottom: 1,
      paddingLeft: 1,
      paddingRight: 1,
      height: 20,
      width: 20
    }}>
      <Text>1</Text>
    </Badge>
  );
}
