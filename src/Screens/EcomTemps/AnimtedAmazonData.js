import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
const {width,height}=Dimensions.get('window')

const AnimtedAmazonData = ({ index, item, curIndex }) => {
    const animation = useSharedValue(0)
    console.log(item.id , curIndex, 'index == curIndex');
    useEffect(() => {
      if (item.id == curIndex) {
        animation.value = withTiming(1);
        return;
      }
      animation.value = withTiming(0);
    }, [curIndex]);
    const viewStyle = useAnimatedStyle(() => {
      const heightV = interpolate(
        animation?.value,
        [0, 1, 0],
        [height/7, height/3,height/7 ],
        Extrapolate.CLAMP,
      );
      const opacity = interpolate(
        animation?.value,
        [0, 1, 0],
        [0, 1,0 ],
        Extrapolate.CLAMP,
      );
      return {
          height: heightV,
          opacity
      }
    })
  return (
    <Animated.View
    style={[{
      backgroundColor: 'green',
      marginHorizontal: 10,
      marginBottom: 10,
    },viewStyle]}>
    <Text>{item?.id}</Text>
    </Animated.View>  )
}

export default AnimtedAmazonData

const styles = StyleSheet.create({})