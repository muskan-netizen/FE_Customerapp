import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {customMarginBottom} from '../../../utils/constants/constants';
import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import MultiScreen from '../../../Components/MultiScreen';
import imagePath from '../../../constants/imagePath';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import navigationStrings from '../../../navigation/navigationStrings';
import Header from '../../../Components/Header';
import {FlatList} from 'react-native';

const RoyoProducts = (props) => {
  const {navigation} = props;

  const [state, setState] = useState({activeIndex: 0, headerText: 'Products'});

  const {activeIndex, headerText} = state;

  const updateState = (data) =>
    setState((state) => {
      return {...state, ...data};
    });

  //   const {product} = useSelector((state) => state.product);
  const product = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const renderItem = (data, rowMap) => {
    const {item, index} = data;
    return (
      <View
        style={{
          padding: moderateScale(18),
          borderRadius: moderateScale(6),
          backgroundColor: colors.whiteSmokeColor,
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

  const selectedOrder = (index) => {
    if (index == 0) updateState({activeIndex: index, headerText: 'Products'});
    else updateState({activeIndex: index, headerText: 'Categories'});
  };

  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        centerTitle={`${headerText} | Foodies hub  `}
        noLeftIcon
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
      />
      <View style={styles.container}>
        <MultiScreen
          tabTextStyle={{marginTop: moderateScaleVertical(0)}}
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
              onPress={() =>
                navigation.navigate(navigationStrings.ROYO_ADD_PRODUCT)
              }
              btnStyle={styles.productBtn}
              btnText="+  products"
            />
          </View>
        ) : null}
        {activeIndex == 1 ? (
          <View
            style={{
              flex: 1,
            }}>
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7]}
              keyExtractor={(item, index) => index}
              bounces={false}
              showsVerticalScrollIndicator={false}
              numColumns={width > 600 ? 5 : 3}
              renderItem={({item, index}) => (
                <View
                  key={index}
                  style={{
                    marginBottom: moderateScaleVertical(16),
                    marginLeft:
                      width > 600
                        ? index % 5
                          ? moderateScale(10)
                          : 0
                        : index % 3
                        ? moderateScale(10)
                        : 0,
                  }}>
                  <TouchableOpacity style={styles.categoryItem}>
                    <Image
                      style={{
                        resizeMode: 'center',
                        width:
                          width > 600
                            ? (width - moderateScale(173)) / 5
                            : (width - moderateScale(112)) / 3,
                        height:
                          width > 600
                            ? (width - moderateScale(203)) / 5
                            : (width - moderateScale(152)) / 3,
                      }}
                      source={imagePath.testingImageRoyo}
                    />
                  </TouchableOpacity>
                  <Text style={{textAlign: 'center'}}>pizza</Text>
                </View>
              )}
            />

            <ButtonWithLoader
              onPress={() =>
                navigation.navigate(navigationStrings.ROYO_ADD_PRODUCT)
              }
              btnStyle={styles.categoryBtn}
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
    // marginTop: moderateScaleVertical(24),
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
  categoryItem: {
    alignSelf: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(16),
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScaleVertical(6),
  },
  productBtn: {
    position: 'absolute',
    padding: moderateScale(10),
    bottom: moderateScaleVertical(20),
    right: moderateScale(10),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
  },
  categoryBtn: {
    position: 'absolute',
    padding: moderateScale(10),
    bottom: moderateScaleVertical(20),
    right: moderateScale(10),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
  },
});
