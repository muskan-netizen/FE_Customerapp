import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AnimtedAmazonData from './AnimtedAmazonData';
const {width,height}=Dimensions.get('window')
const DATA = [
  {
    id: 1,
    title: 'First Item',
  },
  {
    id: 2,
    title: 'Second Item',
  },
  {
    id: 3,
    title: 'Third Item',
  },
  {
    id: 4,
    title: 'First Item',
  },
  {
    id: 5,
    title: 'Second Item',
  },
  {
    id: 6,
    title: 'Third Item',
  },
];

let dataa = DATA.slice(-3);

export const RenderItem = ({ index, item, onPress = () => { }, curIndex }) => {

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
    const marginTop = interpolate(
      animation?.value,
      [0, 1, 0],
      [0, 10, 0],
      Extrapolate.CLAMP,
    );
    return {
      marginTop,
    }
  })
  return (
    <Animated.View style={viewStyle}>
      <TouchableOpacity
        style={{ backgroundColor: 'red', height: height/5,width:width/3.5, marginBottom: 10 }}
        onPress={onPress}>
        <Text style={{}}>{item.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const App = () => {
  const [curIndex, setCurIndex] = useState();

  const renderItem = ({ item, index }) => {
    return (
      <RenderItem
        index={index}
        item={item}
        curIndex={curIndex}
        onPress={() => { setCurIndex(item.id) }}
      />
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        numColumns={3}
        keyExtractor={item => item.id}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginHorizontal: 10,
        }}
        ItemSeparatorComponent={i =>
          i?.leadingItem?.map(it => {
            if (it?.id === curIndex) {
              return <AnimtedAmazonData item={it} key={it?.id} curIndex={curIndex } />;
            }
          })
        }
        ListFooterComponent={() =>
          dataa.map(it => {
            if (it?.id === curIndex) {
              return <AnimtedAmazonData item={it} key={it?.id} curIndex={curIndex }/>;
            }
          })
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
