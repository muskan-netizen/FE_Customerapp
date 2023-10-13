import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Header from '../../Components/Header';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import WrapperContainer from '../../Components/WrapperContainer';
import GradientButton from '../../Components/GradientButton';
import Modal from '../../Components/Modal';
import AtlanticHeader from '../../Components/AtlanticHeader';
import navigationStrings from '../../navigation/navigationStrings';
import AtlanticBottom from '../../Components/AtlanticBottom';
import actions from '../../redux/actions';
import {useSelector} from 'react-redux';
import {showSuccess} from '../../utils/helperFunctions';
import {
  numberFormate,
  numberOfArraySum,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import styles from './styles';
// create a component
const Protection = ({
  navigation,
  productDetailData,
  onBackPress = () => {},
  onPressProtection = () => {},
  onModalClose = () => {},
  modalopen,
  addProtection = () => {},
  addOns = () => {},
  onPressNext = () => {},
  rentalProtectionData,
  setRentalProtectionData = () => {},
}) => {
  const [isLoader, setIsLoader] = useState(false);

  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector(state => state?.initBoot);
  const {
    additional_preferences,
    digit_after_decimal,
    seller_sold_title,
    seller_platform_logo,
  } = appData?.profile?.preferences || {};

  useEffect(() => {
    getRentalProtection();
  }, []);

  let protectionPrice = rentalProtectionData?.excluded?.filter((item)=>item?.addProtection)?.map((item)=> item?.rental_protection?.price)

  console.log(protectionPrice, 'rentalProtectionData');
  const getRentalProtection = async () => {
    setIsLoader(true);
    await actions
      .rentalProtection(
        {
          product_id: productDetailData?.id,
          vendor_id: productDetailData?.vendor?.id,
        },
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          product_id: productDetailData?.id,
          vendor_id: productDetailData?.vendor?.id,
        },
      )
      .then(res => {
        console.log(res, 'errorerrorerror');
        setRentalProtectionData(res?.data);
        addOns(res?.data?.addons);
        setIsLoader(false);
        showSuccess(res?.status);
      })
      .catch(error => {
        console.log(error, 'errorerrorerror');
        setIsLoader(false);
        showSuccess(error?.status);
      });
  };

  return (
    <WrapperContainer isLoading={isLoader} >
      <AtlanticHeader
        // leftIcon={imagePath.ic_backarrow}
        lefttext={strings.select_protection}
        onPressLeft={onBackPress}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flexGrow: 1, marginBottom: moderateScaleVertical(104)}}>
        <Text style={styles.topdescription}>Included in your booking</Text>
        {rentalProtectionData?.included?.map(item => {
          return (
            <View style={styles.topflalist}>
              <View style={{flexDirection: 'row'}}>
                <Image source={imagePath.tickrental} />
                <Text style={styles.toptext}>
                  {item?.rental_protection?.title}
                </Text>
              </View>
            </View>
          );
        })}

        <FlatList
          data={rentalProtectionData?.excluded || []}
          renderItem={({item, index}) => (
            <>
              <TouchableOpacity
                // onPress={() => {
                //   setmodalopen(true);
                //   setSelectedProtection(item);
                // }}
                onPress={() => onPressProtection(item, index)}
                style={[
                  styles.greyview,
                  {
                    borderWidth: !!item?.addProtection? 1 : 0,
                    borderColor: !!item?.addProtection
                      ? themeColors?.primary_color
                      : colors.greyColor,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: moderateScaleVertical(10),
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Image source={imagePath.protection} />
                    <Text style={styles.listheading}>
                      {item?.rental_protection?.title}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      color: colors.atlanticgreen,
                      fontFamily: fontFamily.semiBold,
                    }}>
                    {tokenConverterPlusCurrencyNumberFormater(
                      Number(item?.rental_protection?.price),
                      digit_after_decimal,
                      additional_preferences,
                      currencies?.primary_currency?.symbol,
                    )}
                    {` / ${
                      item?.rental_protection?.validity == 1
                        ? strings.DOLLAR_DAY
                        : item?.rental_protection?.validity == 2
                        ? strings.DOLLAR_MONTH
                        : strings.YEAR
                    }`}
                  </Text>
                </View>

                {/* <Text style={styles.listsubhead}>
                Financial Responsibility:
                <Text
                  style={{
                    fontSize: textScale(12),
                    color: colors.atlanticgreen,
                  }}>
                  {' '}
                  $0.00
                </Text>
              </Text> */}
                {[1, 2].map(() => {
                  return (
                    <View style={styles.categoriesview}>
                      <View style={{flexDirection: 'row'}}>
                        <Image source={imagePath.tickrental} />
                        <Text style={[styles.listtext,{maxWidth:width/1.5}]}>
                          {item?.rental_protection?.description}
                        </Text>
                      </View>
                      <Image source={imagePath.Info} style={styles.listimage} />
                    </View>
                  );
                })}
              </TouchableOpacity>

              <Modal
                onPress={() => onModalClose(index)}
                mainViewStyle={{paddingTop: moderateScale(0)}}
                isVisible={!!item?.showModal}
                modalMainContent={() => (
                  <View>
                    <TouchableOpacity
                      onPress={() => onModalClose(index)}
                      style={{
                        alignSelf: 'flex-end',
                        justifyContent: 'flex-end',
                        padding: moderateScale(10),
                      }}>
                      <Image
                        source={imagePath.redCross}
                        style={{
                          tintColor: colors.black,
                          height: moderateScaleVertical(12),
                          width: moderateScale(12),
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        paddingHorizontal: moderateScale(46),
                        paddingBottom: moderateScaleVertical(16),
                      }}>
                      <Text
                        style={{
                          fontFamily: fontFamily.bold,
                          fontSize: textScale(16),
                          alignSelf: 'center',
                          textAlign: 'center',
                        }}>
                        Continue without additional protection?
                      </Text>
                      <Text
                        style={{
                          fontSize: textScale(13),
                          textAlign: 'center',
                          marginTop: moderateScaleVertical(10),
                        }}>
                        You are liable for all damage and theft up to the full
                        value of the rental vehicle plus admin fees.
                      </Text>
                      <GradientButton
                        btnText={!!item?.addProtection?  strings.REMOVE_PROTECTION :strings.ADD_PROTECTION}
                        btnStyle={{
                          height: moderateScaleVertical(30),
                          // width: '46%',
                          alignSelf: 'center',
                          borderRadius: moderateScale(4),
                          marginTop: moderateScale(10),
                        }}
                        onPress={()=>addProtection(item, index)}
                        textStyle={{fontSize: textScale(10)}}
                      />
                      <TouchableOpacity onPress={() => onModalClose(index)}>
                        <Text
                          style={{
                            fontSize: textScale(10),
                            color: colors.atlanticgreen,
                            fontFamily: fontFamily.bold,
                            textAlign: 'center',
                            marginTop: moderateScaleVertical(8),
                          }}>
                          {strings.SKIP_FOR_NOW}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </>
          )}
        />
      </ScrollView>
      <AtlanticBottom
        Totalprice={strings.TOTAL_PRICE}
        total={tokenConverterPlusCurrencyNumberFormater(
          numberFormate(productDetailData?.variant[0]?.price) + numberOfArraySum(protectionPrice), 
            // numberFormate(selectedProtection?.rental_protection?.price),
          digit_after_decimal,
          additional_preferences,
          currencies?.primary_currency?.symbol,
        )}
        btnText={strings.NEXT}
        onPress={() =>
          onPressNext(
            numberFormate(productDetailData?.variant[0]?.price) +
            numberOfArraySum(protectionPrice)
              // numberFormate(selectedProtection?.rental_protection?.price),
          )
        }
      />
    </WrapperContainer>
  );
};

// define your styles

//make this component available to the app
export default Protection;
