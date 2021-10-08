import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {customMarginBottom} from '../../../utils/constants/constants';
import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import MultiScreen from '../../../Components/MultiScreen';
import imagePath from '../../../constants/imagePath';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import {Platform} from 'react-native';
import navigationStrings from '../../../navigation/navigationStrings';

const RoyoProducts = (props) => {
  const {navigation} = props;

  const [state, setState] = useState({activeIndex: 0});

  const {activeIndex} = state;

  const updateState = (data) =>
    setState((state) => {
      return {...state, ...data};
    });

  //   const {product} = useSelector((state) => state.product);
  const product = [1, 2, 3, 4];
  const renderItem = (data, rowMap) => {
    const {item, index} = data;
    return (
      <View
        style={{
          padding: moderateScale(18),
          borderRadius: moderateScale(6),
          backgroundColor: '#F5F5F5',
          flexDirection: 'row',
          marginBottom: moderateScaleVertical(16),
        }}>
        <TouchableOpacity style={{alignSelf: 'center'}}>
          <Image
            style={styles.imageStyle}
            source={{
              uri: 'https://cdn.britannica.com/q:60/08/177308-050-94D9D6BE/Food-Pizza-Basil-Tomato.jpg',
            }}
          />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fontFamily.medium,
                  color: colors.black,
                }}>
                item.Name
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: 13,
                  color: colors.blackOpacity40,
                }}>
                item.Product
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.font16Semibold}>In Stock</Text>
              <TouchableOpacity>
                <Image source={imagePath.inStockRoyo} />
              </TouchableOpacity>
            </View>
            {/* <Image style={{alignSelf: 'flex-end'}} source={imagePath.share} /> */}
          </View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontFamily.regular,
              color: colors.blackOpacity86,
              marginTop: moderateScaleVertical(8),
            }}>
            $item.mrp hi this is very delicious pizza from one of your favourite
            pizza station.
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: 14,
              color: colors.black,
              marginTop: moderateScaleVertical(4),
            }}>
            $
          </Text>
          {/*item.salePrice*/}
        </View>
      </View>
    );
  };
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
            Products | Foodies hub {'  '}
          </Text>
          <Image source={imagePath.dropDownNew} />
        </View>

        <MultiScreen
          screenName={['Products', 'Categories', '', '', '']}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
        />
        {activeIndex == 0 ? (
          <View style={{flex: 1}}>
            <SwipeListView
              bounces={false}
              data={product}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              renderHiddenItem={(data, rowMap) => (
                <View style={styles.rowReverse}>
                  <TouchableOpacity
                    style={{
                      ...styles.hiddenButton,
                      backgroundColor: '#FFC8C8',
                    }}>
                    <Image source={imagePath.deleteRoyo} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.hiddenButton,
                      backgroundColor: '#C8F3FF',
                    }}>
                    <Image source={imagePath.editRoyo} />
                  </TouchableOpacity>
                </View>
              )}
              disableRightSwipe
              rightOpenValue={-moderateScale(100)}
            />
            <ButtonWithLoader
              onPress={() => navigation.navigate(navigationStrings.ROYO_ADD_PRODUCT)}
              btnStyle={{
                position: 'absolute',
                padding: moderateScale(10),
                bottom: moderateScaleVertical(20),
                right: moderateScale(10),
                borderRadius: moderateScale(100),
                paddingHorizontal: moderateScale(15),
              }}
              btnText="+  products"
            />
          </View>
        ) : null}
        {activeIndex == 1 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
              return (
                <View
                  key={index}
                  style={{marginBottom: moderateScaleVertical(16),}}>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#D8D8D8',
                      paddingHorizontal: 10,
                      paddingVertical: moderateScaleVertical(16),
                      marginBottom: moderateScaleVertical(8),
                      borderRadius: moderateScaleVertical(6),
                    }}>
                    <Image
                      style={{
                        width: moderateScale(75),
                        height: moderateScaleVertical(65),
                      }}
                      source={{
                        uri: 'https://cdn.britannica.com/q:60/08/177308-050-94D9D6BE/Food-Pizza-Basil-Tomato.jpg',
                      }}
                    />
                  </TouchableOpacity>
                  <Text style={{textAlign: 'center'}}>pizza</Text>
                </View>
              );
            })}
            <ButtonWithLoader
              onPress={() => navigation.navigate(navigationStrings.ROYO_ADD_PRODUCT)}
              btnStyle={{
                position: 'absolute',
                padding: moderateScale(10),
                bottom: moderateScaleVertical(20),
                right: moderateScale(10),
                borderRadius: moderateScale(100),
                paddingHorizontal: moderateScale(15),
              }}
              btnText="+  category"
            />
          </View>
        ) : null}
      </View>
    </WrapperContainer>
  );
};

export default RoyoProducts;

const styles = StyleSheet.create({
  font16Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: '#4CB549',
    marginRight: moderateScale(10),
  },
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
    width: moderateScale(60),
    height: moderateScaleVertical(60),
    borderRadius: 6,
    marginRight: moderateScale(18),
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    height: '100%',
    // alignItems: 'center',
  },
  hiddenButton: {
    paddingHorizontal: moderateScale(14),
    marginBottom: moderateScale(16),
    borderRadius: moderateScaleVertical(8),
    justifyContent: 'center',
    marginLeft: moderateScale(8),
  },
});
