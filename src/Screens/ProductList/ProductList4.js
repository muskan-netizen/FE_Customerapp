import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import {width} from '../../styles/responsiveSize';
import arrayData from './data';
export default function Products() {
  const [currIndex, setCurrIndex] = useState(0);

  const renderItem = ({item, index}) => {
    console.log('item++', item);

    return (
      <View
        style={{
          height: 30,
          marginRight: 8,
          backgroundColor: index == currIndex ? 'blue' : 'white',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 8,
        }}>
        <Text
          style={{
            color: index == currIndex ? 'white' : 'black',
          }}>
          {item.category}
        </Text>
      </View>
    );
  };
  const renderChildren = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: 'red',
          marginRight: 8,
          height: 100,
        }}>
        <Text>{item.name}</Text>
      </View>
    );
  };
  const onEnd = () => {
    setCurrIndex(currIndex + 1);
  };
  return (
    <WrapperContainer>
      <View>
        <FlatList horizontal data={arrayData} renderItem={renderItem} />
      </View>
      <FlatList
        data={arrayData[currIndex].child}
        renderItem={renderChildren}
        onEndReached={onEnd}
      />
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
