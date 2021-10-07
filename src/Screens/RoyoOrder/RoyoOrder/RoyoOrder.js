import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import MultiScreen from '../../../Components/MultiScreen';
import OrderCard from '../../../Components/OrderCard';
import imagePath from '../../../constants/imagePath';
import {FlatList} from 'react-native';
import {
  customMarginBottom,
  customMarginLeftForBox,
  noOfColumn,
} from '../../../utils/constants/constants';

const RoyoOrder = (props) => {
  const [state, setState] = useState({activeIndex: 0});
  const {activeIndex} = state;
  const updateState = (data) =>
    setState((state) => {
      return {...state, ...data};
    });

  const data = [
    imagePath.cabImage,
    imagePath.contactIllustration,
    imagePath.listViewIcon,
    imagePath.icoTimeOrder,
  ];

  // useFocusEffect(
  //   useCallback(() => {
  //     alert("focus");
  //   }, [])
  // );

  const selectedOrder = (index) => {
    updateState({activeIndex: index});
  };

  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: textScale(15),
              textAlign: 'center',
            }}>
            Orders | Foodies hub {'  '}
          </Text>
          <Image source={imagePath.dropDownNew} />
        </View>

        <MultiScreen
          screenName={['new', 'confirmed', 'cancelled', 'completed']}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
        />
        {activeIndex == 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={['Cash', 'Card', 'Cash', 'Cash']}
            numColumns={noOfColumn}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    marginLeft: customMarginLeftForBox(index),
                    flex: 1,
                  }}>
                  <OrderCard data={data} index={index} mode={item} />
                </View>
              );
            }}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 1 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={['Cash', 'Card', 'Cash']}
            numColumns={noOfColumn}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    marginLeft: customMarginLeftForBox(index),
                    flex: 1,
                  }}>
                  <OrderCard
                    data={data}
                    index={index}
                    mode={item}
                    status="Confirmed"
                  />
                </View>
              );
            }}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 2 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={['Cash', 'Cash']}
            numColumns={noOfColumn}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    marginLeft: customMarginLeftForBox(index),
                    flex: 1,
                  }}>
                  <OrderCard
                    data={data}
                    index={index}
                    mode={item}
                    status="Cancelled"
                  />
                </View>
              );
            }}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 3 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={['Cash']}
            numColumns={noOfColumn}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    marginLeft: customMarginLeftForBox(index),
                    flex: 1,
                  }}>
                  <OrderCard
                    data={data}
                    index={index}
                    mode={item}
                    status="Completed"
                  />
                </View>
              );
            }}
            keyExtractor={(item, key) => key}
          />
        ) : null}
      </View>
    </WrapperContainer>
  );
};

export default RoyoOrder;

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScaleVertical(24),
    marginHorizontal: moderateScale(16),
    marginBottom: customMarginBottom(),
    flex: 1,
  },

  textStyle: {
    color: colors.black,
    fontSize: 24,
    fontFamily: fontFamily.bold,
  },
  imageStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(34),
    marginLeft: moderateScaleVertical(20),
  },
});
