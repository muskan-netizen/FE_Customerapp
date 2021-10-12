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
import navigationStrings from '../../../navigation/navigationStrings';
import Header from '../../../Components/Header';

const RoyoOrder = (props) => {
  const {navigation} = props;

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
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        centerTitle="Orders | Foodies hub  "
        noLeftIcon
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
      />
      <View style={styles.container}>
        <MultiScreen
          tabTextStyle={{marginTop: moderateScaleVertical(0)}}
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
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyCartBody}>
                  <Image source={imagePath.emptyCartRoyo} />
                </View>
              );
            }}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    marginLeft: customMarginLeftForBox(index),
                    flex: 1,
                  }}>
                  <OrderCard
                    onPress={() =>
                      navigation.navigate(navigationStrings.ROYO_ORDER_DETAIL)
                    }
                    data={data}
                    index={index}
                    mode={item}
                  />
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
            data={[]}
            numColumns={noOfColumn}
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyCartBody}>
                  <Image source={imagePath.emptyCartRoyo} />
                </View>
              );
            }}
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
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyCartBody}>
                  <Image source={imagePath.emptyCartRoyo} />
                </View>
              );
            }}
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
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyCartBody}>
                  <Image source={imagePath.emptyCartRoyo} />
                </View>
              );
            }}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    marginLeft: customMarginLeftForBox(index),
                    // flex: 0.5,
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
    // marginTop: moderateScaleVertical(24),
    marginHorizontal: moderateScale(16),
    marginBottom: customMarginBottom(),
    flex: 1,
  },
  emptyCartBody: {
    flex: 1,
    justifyContent: 'center',
    height: 400,
    alignItems: 'center',
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
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  font15Bold: {
    fontFamily: fontFamily.bold,
    fontSize: textScale(15),
    textAlign: 'center',
  },
});
