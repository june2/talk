import React from 'react';
import { AdMobBanner } from 'expo-ads-admob'
import { Platform, View } from "react-native";
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
        bannerSize="banner"
        adUnitID={
          Platform.OS === 'ios'
            ? config.IOSAdUnitID
            : config.AndroidAdUnitID
        }
        testDeviceID={config.deviceID}
        onDidFailToReceiveAdWithError={(err) => console.log(`fail ${err}`)}
        onAdMobDispatchAppEvent={(evt) => console.log(evt)}
      />
    </View>
  );
}
