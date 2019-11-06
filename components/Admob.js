import React from 'react';
import { AdMobBanner } from 'expo-ads-admob'
import { View } from "react-native";
import config from '../constants/Config'

export default function Admob() {
  return (
    <View>
      <AdMobBanner
        style={{
          position: "absolute",
          top: 0,
          zIndex: 2,
        }}
        bannerSize="fullBanner"
        adUnitID={config.adUnitID}
        // Test ID, Replace with your-admob-unit-id
        // testDeviceID={config.deviceID}
        onDidFailToReceiveAdWithError={(err) => console.log(err)}
        onAdMobDispatchAppEvent={(evt) => console.log(evt)}
      />
    </View>
  );
}
