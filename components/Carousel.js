import React, { Component } from 'react'
import { Animated, View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native'
import { observer } from 'mobx-react';
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
})