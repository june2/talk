import React from 'react';
import { Platform, View } from "react-native";
import firebase from 'react-native-firebase';
import config from '../constants/Config'
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob'

export default function Admob() {
  const Banner = firebase.admob.Banner;
  const AdRequest = firebase.admob.AdRequest;
  const request = new AdRequest();
  return (
    <View>
      {Platform.OS === 'ios' ?
        <AdMobBanner
          adSize="smartBannerPortrait"
          adUnitID={config.unitId}
          testDevices={[AdMobBanner.simulatorId]}
        // onAdFailedToLoad={error => console.log(error)}
        /> : <Banner
          unitId={config.unitId}
          size={'SMART_BANNER'}
          request={request.build()}
        // onAdLoaded={() => {
        //   console.log('Advert loaded');
        // }}
        />
      }
    </View>
  );
}

