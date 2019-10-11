import React, { Component } from 'react'
import { Animated, View, StyleSheet, Image, Dimensions, ScrollView, Text } from 'react-native'
import { observer } from 'mobx-react';
import { BlurView } from 'expo-blur';
import authStore from '../stores/AuthStore';
import config from '../constants/Config';


const deviceWidth = Dimensions.get('window').width
const FIXED_BAR_WIDTH = 30
const BAR_SPACE = 10

@observer
export default class CarouselScreen extends Component {
  numItems = this.props.images.length;
  // itemWidth = (FIXED_BAR_WIDTH / this.numItems) - ((this.numItems - 1) * BAR_SPACE)  
  itemWidth = FIXED_BAR_WIDTH;
  animVal = new Animated.Value(0)

  render() {
    let imageArray = []
    let barArray = []

    this.props.images.forEach((image, i) => {
      const thisImage = (
        <Image
          key={`image${i}`}
          source={{ uri: image }}
          style={{ width: deviceWidth }}
        />
      )
      imageArray.push(thisImage);

      const scrollBarVal = this.animVal.interpolate({
        inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
        outputRange: [-this.itemWidth, this.itemWidth],
        extrapolate: 'clamp',
      })

      const thisBar = (
        <View
          key={`bar${i}`}
          style={[
            styles.track,
            {
              width: this.itemWidth,
              marginLeft: i === 0 ? 0 : BAR_SPACE,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.bar,
              {
                width: this.itemWidth,
                transform: [
                  { translateX: scrollBarVal },
                ],
              },
            ]}
          />
        </View>
      )
      barArray.push(thisBar)
    })

    // if image empty 
    if (imageArray.length === 0) {
      imageArray.push(<Image
        key='0'
        source={{ uri: config.defaultUserImg }}
        style={{ width: deviceWidth }}
      />);
    }

    return (
      <View style={styles.container}>
        {(!this.props.isMe)
          ?
          <BlurView tint="light"
            intensity={(authStore.me.images.length === 0) ? 90 : 0}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: (authStore.me.images.length === 0) ? 3 : -1
            }}>
            <View style={styles.blurView}>
              <Text>사진을 보려면 자기 사진 한개이상 등록해주세요.</Text>
            </View>
          </BlurView>
          : null
        }
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.animVal } } }]
            )
          }
        >
          {imageArray}
        </ScrollView>
        <View style={styles.barContainer}>
          {barArray}
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barContainer: {
    position: 'absolute',
    zIndex: 2,
    bottom: 10,
    flexDirection: 'row',
  },
  track: {
    backgroundColor: '#ccc',
    overflow: 'hidden',
    height: 2,
  },
  bar: {
    backgroundColor: '#5294d6',
    height: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  blurView: {
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  }
})