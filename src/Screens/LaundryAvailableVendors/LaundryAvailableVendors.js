import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import actions from '../../redux/actions';
import {useSelector} from 'react-redux';
import {getImageUrl, showError, showSuccess} from '../../utils/helperFunctions';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang';
import Header from '../../Components/Header';
import imagePath from '../../constants/imagePath';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import colors from '../../styles/colors';
import DeviceInfo from 'react-native-device-info';
import {isEmpty} from 'lodash';
import navigationStrings from '../../navigation/navigationStrings';

export default function LaundryAvailableVendors({navigation, route}) {
  const paramData = route?.params?.data;
  const {
    appData,
    currencies,
    languages,
    appStyle,

    themeColors,
  } = useSelector((state) => state?.initBoot);

  const {dineInType} = useSelector((state) => state?.home);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const [isLoading, setLoading] = useState(true);
  const [allVendors, setAllVendors] = useState([]);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };
  useEffect(() => {
    actions
      .productEstimation(
        {product: paramData?.selectedAddonSet},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'res>>>>>>res');
        setLoading(false);
        setAllVendors(res?.data);
      })
      .catch(errorMethod);
  }, []);

  const errorMethod = (error) => {
    console.log(error, 'errorinErrorMethod....');
    showError(error?.message || error?.error);
  };

  const onSelectVendorAddToCart = (item) => {
    console.log(item, 'item>>>>>item');
    let addonIds = [];
    let addonOptionIds = [];
    item?.products_live[0]?.sets?.map((item, index) => {
      addonIds[index] = item?.addon_id;
      // addonOptionIds[index] = item?.id;
    });
    let data = {};
    data['sku'] = item?.products_live[0]?.sku;
    data['quantity'] = 1;
    data['product_variant_id'] = item?.products_live[0]?.variant_id;

    data['type'] = dineInType;
    if (!isEmpty(addonIds)) {
      data['addon_ids'] = addonIds;
      // data['addon_options'] = addonOptionIds;
    }
    console.log(data, 'data sendin in API');

    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        showSuccess(strings.PRODUCT_ADDED_SUCCESS);
        moveToNewScreen(navigationStrings.CART)();
      })
      .catch(errorMethod);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.mainRowStyle}>
        <View style={{flex: 0.2}}>
          <FastImage
            source={{
              uri: getImageUrl(
                item?.banner?.image_fit,
                item?.banner?.image_path,
                '600/6000',
              ),
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={styles.vendorImgStyle}
          />
        </View>
        <View style={styles.completePartialMatchView}>
          <Text style={styles.completePartialMatchTxt}>COMPLETE MATCH</Text>
        </View>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            flex: 0.8,
          }}>
          <Text style={styles.vendorTitle}>{item?.name}</Text>
          <View style={styles.locationImgView}>
            <Image
              source={imagePath.icLocationBlue}
              style={{
                tintColor: themeColors.primary_color,
              }}
            />
            <Text style={styles.addressTxt}>{item?.address}</Text>
          </View>
          <Text style={styles.priceText}>
            {currencies?.primary_currency?.symbol} {item?.product_price}
          </Text>
          <ButtonWithLoader
            onPress={() => onSelectVendorAddToCart(item)}
            btnText="Select Vendor"
            btnTextStyle={styles.selectVendorBtnTxt}
            btnStyle={styles.selectVendorBtnStyle}
          />
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer>
      <Header centerTitle={'Available Vendors'} leftIcon={imagePath.icBackb} />

      <FlatList
        data={allVendors}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: moderateScaleVertical(16),
          marginTop: moderateScaleVertical(15),
        }}
        ItemSeparatorComponent={() => (
          <View style={{height: moderateScaleVertical(16)}} />
        )}
      />
    </WrapperContainer>
  );
}

export function stylesFunc({fontFamily, themeColors, isDarkMode}) {
  const styles = StyleSheet.create({
    mainRowStyle: {
      backgroundColor: '#F2F7FA',
      flexDirection: 'row',
      paddingLeft: moderateScale(15),
      paddingVertical: moderateScaleVertical(10),
      borderRadius: moderateScale(5),
    },
    vendorImgStyle: {
      height: moderateScale(70),
      width: moderateScale(70),
      borderRadius: moderateScale(35),
    },
    completePartialMatchView: {
      backgroundColor: '#DBEBCB',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: moderateScale(4),
      paddingVertical: moderateScale(4),
      position: 'absolute',
      right: 10,
      top: 10,
      borderRadius: moderateScale(2),
    },
    completePartialMatchTxt: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(8),
      color: '#719F1C',
    },
    vendorTitle: {
      fontFamily: fontFamily?.bold,
      fontSize: textScale(14),
      color: colors.black,
    },
    locationImgView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScaleVertical(6),
    },
    addressTxt: {
      marginLeft: 5,
      fontFamily: fontFamily?.regular,
      fontSize: textScale(12),
      color: colors.blackOpacity43,
    },
    priceText: {
      marginTop: moderateScaleVertical(6),
      fontFamily: fontFamily?.bold,
      fontSize: textScale(14),
      color: colors.black,
    },
    selectVendorBtnTxt: {
      color: themeColors.primary_color,
      textTransform: 'none',
      fontSize: textScale(14),
    },
    selectVendorBtnStyle: {
      marginTop: moderateScaleVertical(20),
      height: moderateScaleVertical(40),
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
      borderWidth: 1,
    },
  });
  return styles;
}
