import React, {useEffect, useState} from 'react';
import {FlatList, Image, ScrollView, Text, View} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import EmptyListLoader from '../../Components/EmptyListLoader';
import Header2 from '../../Components/Header2';
import ProductLoader2 from '../../Components/Loaders/ProductLoader2';
import ThreeColumnCard2 from '../../Components/ThreeColumnCard2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {getImageUrl, showError} from '../../utils/helperFunctions';

export default function VendorDetail2({navigation, route}) {
  let vendorParams = route?.params?.data;
  console.log(vendorParams, 'VendorDetail params');

  const [state, setState] = useState({
    vendorId: vendorParams?.item?.id,
    vendorData: [],
    isLoading: true,
    limit: 12,
    pageNo: 1,
  });
  const {vendorId, vendorData, isLoading, limit, pageNo} = state;
  useEffect(() => {
    if (
      vendorParams &&
      vendorParams?.item &&
      vendorParams?.item?.redirect_to == staticStrings.SUBCATEGORY
    ) {
      getSubCategoryDetailData();
    } else {
      getVendorDetailData();
    }
  }, [vendorId]);

  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  /***********GET SUBCATEGORY  DETAIL DATA******** */

  const getSubCategoryDetailData = () => {
    // console.log(data, 'vendor_id');
    actions
      .getProductByCategoryId(
        `/${vendorId}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log();
        updateState({isLoading: false});
        if (res && res.data) {
          updateState({vendorData: res.data.listData});
        }
        console.log(res, 'Vendor data response');
      })
      .catch(errorMethod);
  };
  /*********** */

  /*********GET VENDOR DETAIL********* */
  const getVendorDetailData = () => {
    let data = {};
    data['vendor_id'] = vendorId;
    console.log(data, 'vendor_id');
    actions
      .getVendorDetail(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        updateState({isLoading: false});
        if (res && res.data) {
          let newArray = res.data;
          // if (vendorParams?.rootProducts) {
          //   // console.log(
          //   //   newArray.filter((x) => x?.id != vendorParams?.categoryData?.id),
          //   //   'newArray>>>>',
          //   // );
          //   newArray= newArray.filter((x) => x?.id != vendorParams?.categoryData?.id)
          // }
          updateState({vendorData: newArray});
        }
        console.log(res, 'Vendor data response');
      })
      .catch(errorMethod);
  };

  /********* */

  const errorMethod = (error) => {
    console.log(error, 'Error>>>>>');
    updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const _renderItem = ({item, index}) => {
    console.log(item, 'vendorDatavendorData');

    return (
      <ThreeColumnCard2
        onPress={moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item.id,
          rootProducts: vendorParams?.rootProducts,
          // vendor: true,
          // rootProducts:
          name: item.name,
        })}
        // onPress={() => navigation.navigate(navigationStrings.PRODUCT_LIST)}
        data={item}
        withTextBG
        cardIndex={index}
      />
    );
  };

  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={colors.backgroundGrey}>
      {/* <Header centerTitle={vendorParams?.item?.name} hideRight={false} /> */}

      <Header2
        leftIcon={imagePath.backArrow}
        centerTitle={vendorParams?.item?.name}
        rightIcon={imagePath.search}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />

      <View style={{...commonStyles.headerTopLine}} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {vendorParams?.item?.redirect_to !== staticStrings.SUBCATEGORY && (
          <View
            style={{
              marginHorizontal: moderateScale(20),
              marginVertical: moderateScaleVertical(15),
            }}>
            <FastImage
              source={{
                uri: getImageUrl(
                  vendorParams?.item?.image?.proxy_url ||
                    vendorParams?.item?.image?.proxy_url ||
                    vendorParams?.item?.banner?.proxy_url,
                  vendorParams?.item?.image?.image_path ||
                    vendorParams?.item?.image?.image_path ||
                    vendorParams?.item?.banner?.image_path,

                  `800/400`,
                ),
              }}
              style={{
                width: moderateScale(95),
                height: moderateScaleVertical(95),
                borderRadius: moderateScale(16),
              }}
            />
            <Text
              style={[
                {
                  ...commonStyles.mediumFont14,
                  opacity: 1,
                  marginTop: moderateScaleVertical(20),
                  fontSize: textScale(18),
                  color: colors.black,
                },
              ]}>
              {vendorParams?.item?.name}
            </Text>
            {/* </TouchableOpacity> */}
            <Text
              style={{
                marginTop: moderateScaleVertical(13),
                fontFamily: fontFamily.regular,
              }}>
              Westheimer Road · 2.9 kms
            </Text>
            <Text
              style={{
                marginTop: moderateScaleVertical(5),
                marginBottom: moderateScaleVertical(15),
                fontFamily: fontFamily.regular,
              }}>
              German · Continental · Chinese
            </Text>

            <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={1}
              dashColor={colors.greyLight}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(15),
                marginRight: moderateScale(70),
              }}>
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={imagePath.starWhite}
                    style={{
                      tintColor: colors.black,
                      height: 10,
                      width: 10,
                      marginRight: moderateScale(5),
                    }}
                  />
                  <Text style={{fontFamily: fontFamily.bold}}>4.0</Text>
                </View>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    color: colors.greyLight,
                  }}>
                  100+ ratings
                </Text>
              </View>

              <View style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: fontFamily.bold}}>33 mins</Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    color: colors.greyLight,
                  }}>
                  Delivery time
                </Text>
              </View>

              <View style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: fontFamily.bold}}>$200</Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    color: colors.greyLight,
                  }}>
                  For two
                </Text>
              </View>
            </View>
          </View>
        )}

        {isLoading ? (
          <View
            style={{
              marginTop: moderateScale(40),
            }}>
            <ProductLoader2 isLoading={isLoading} isProductList />
          </View>
        ) : (
          <>
            <FlatList
              data={vendorData || []}
              // numColumns={3}
              ListHeaderComponent={<View style={{height: 10}} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              // columnWrapperStyle={{justifyContent: 'space-between'}}
              contentContainerStyle={{marginHorizontal: moderateScale(16)}}
              ItemSeparatorComponent={() => (
                <View style={{width: '70%'}}>
                  <DashedLine
                    dashLength={2}
                    dashThickness={1}
                    dashGap={5}
                    dashColor={colors.greyLight}
                  />
                </View>
              )}
              renderItem={_renderItem}
              ListEmptyComponent={<EmptyListLoader />}
              keyExtractor={(item, index) => String(index)}
            />
          </>
        )}
      </ScrollView>
    </WrapperContainer>
  );
}
