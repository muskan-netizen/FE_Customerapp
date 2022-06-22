import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import actions from '../../redux/actions';
import {useSelector} from 'react-redux';
import {getImageUrl, showError} from '../../utils/helperFunctions';
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

export default function LaundryAvailableVendors({navigation, route}) {
  const paramData = route?.params?.data;
  const {
    appData,
    currencies,
    languages,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,
    allAddresss,
    themeColors,
  } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const [isLoading, setLoading] = useState(true);
  const [allVendors, setAllVendors] = useState([]);

  useEffect(() => {
    // return;
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
        console.log(res, '>>>>>res');
        setLoading(false);
        setAllVendors(res?.data);
      })
      .catch(errorMethod);
  }, []);

  const errorMethod = (error) => {
    console.log(error, 'erro>>>>>>errorerrorr');

    showError(error?.message || error?.error);
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: '#F2F7FA',
          flexDirection: 'row',
          paddingLeft: moderateScale(15),
          paddingVertical: moderateScaleVertical(10),
          borderRadius: moderateScale(5),
        }}>
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
            style={{
              height: moderateScale(70),
              width: moderateScale(70),
              borderRadius: moderateScale(35),
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: '#77B700',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: moderateScale(4),
            paddingVertical: moderateScale(4),
            position: 'absolute',
            right: 10,
            top: 10,
            borderRadius: moderateScale(2),
          }}>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(9),
            }}>
            COMPLETE MATCH
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            flex: 0.8,
          }}>
          <Text
            style={{
              fontFamily: fontFamily?.bold,
              fontSize: textScale(14),
              color: colors.black,
            }}>
            {item?.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: moderateScaleVertical(6),
            }}>
            <Image source={imagePath.icLocation1} />
            <Text
              style={{
                marginLeft: 5,
                fontFamily: fontFamily?.regular,
                fontSize: textScale(12),
                color: colors.blackOpacity43,
              }}>
              {item?.address}
            </Text>
          </View>
          <Text
            style={{
              marginTop: moderateScaleVertical(6),
              fontFamily: fontFamily?.bold,
              fontSize: textScale(14),
              color: colors.black,
            }}>
            {'$ 120'}
          </Text>
          <ButtonWithLoader
            btnText="Select Vendor"
            btnTextStyle={{
              color: themeColors.primary_color,
              textTransform: 'none',
              fontSize: textScale(14),
            }}
            btnStyle={{
              marginTop: moderateScaleVertical(20),
              height: moderateScaleVertical(40),
              borderRadius: moderateScale(5),
              borderColor: themeColors.primary_color,
              borderWidth: 1,
            }}
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

const styles = StyleSheet.create({});
