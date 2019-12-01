import React from 'react';
import {
  Badge,
  Text
} from 'native-base';

export default function BadgeIcon(props) {
  if (props && props.num && props.num != 0) {
    return (
      <Badge style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 12 }}>{props.num}</Text>
      </Badge>
    );
  } else {
    return null;
  }
}
