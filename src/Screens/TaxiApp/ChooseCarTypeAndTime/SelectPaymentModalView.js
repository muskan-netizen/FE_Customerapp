import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  height,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import moment from 'moment';
import {string} from 'prop-types';

export default function SelectPaymentModalView({
  isLoading = false,
  onPressBack,
  _confirmAndPay,
  slectedDate = '',
  selectedTime = '',
  totalDistance = 0,
  totalDuration = 0,
  selectedCarOption,
  navigation = navigation,
  couponInfo = null,
  updatedPrice = null,
  removeCoupon,
  loyalityAmount = 0,
  pickUpTimeType = '',
}) {
  console.log(pickUpTimeType, 'pickUpTimeType');
  console.log(selectedTime, 'selectedTime');
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  console.log(selectedCarOption, 'selectedCarOption');
  console.log(slectedDate, 'slectedDate');
  console.log(updatedPrice, 'updatedPrice');
  console.log(loyalityAmount, 'loyalityAmount');
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS2, {
      vendor: vendor,
      cabOrder: true,
      isTaxi: true,

      // cartId: cartData.id,
    })();
  };

  return (
    <View
      style={
        isDarkMode
          ? [
              styles.bottomView,
              {
                backgroundColor: MyDarkTheme.colors.background,
              },
            ]
          : styles.bottomView
      }>
      <ScrollView>
        <View
          style={{
            width: moderateScale(35),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.grayOpacity51,
            height: moderateScale(2),
            marginTop: moderateScale(10),
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            // justifyContent: 'center',
            // alignItems: 'center',
            borderColor: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.grayOpacity51,
            borderBottomWidth: 0.5,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{flex: 0.2, marginStart: moderateScale(18)}}
              onPress={onPressBack}>
              <Image
                style={
                  isDarkMode
                    ? {tintColor: MyDarkTheme.colors.text}
                    : {tintColor: null}
                }
                source={imagePath.backArrowCourier}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 0.6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: textScale(26),
                  fontFamily: fontFamily.medium,
                  marginVertical: moderateScale(10),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {selectedCarOption
                  ? `${currencies?.primary_currency?.symbol}${(
                      Number(selectedCarOption?.variant[0]?.multiplier) *
                      Number(selectedCarOption?.variant[0]?.price)
                    ).toFixed(2)}`
                  : ''}
              </Text>
            </View>
          </View>
          {/* <Text
            style={{
              fontFamily: fontFamily.reguler,
              opacity: 0.5,
              marginBottom: moderateScale(20),
              alignSelf: 'center',
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.ESTIMATION_ONLY}
          </Text> */}
        </View>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: colors.borderColorD,
            borderBottomWidth: 1,
          }}>
          <View style={{flex: 0.33}}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.distanceDurationDeliveryLable,
                      {color: MyDarkTheme.colors.text},
                    ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DISTANCE}
            </Text>
            <Text
              style={[
                styles.distanceDurationDeliveryLable,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}>
              {`${totalDistance} kms`}
            </Text>
          </View>
          <View style={{flex: 0.33}}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.distanceDurationDeliveryLable,
                      {color: MyDarkTheme.colors.text},
                    ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DURATION}
            </Text>
            <Text
              style={[
                styles.distanceDurationDeliveryLable,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}>
              {totalDuration < 60
                ? `${totalDuration} mins`
                : `${(totalDuration / 60).toFixed(2)} hrs`}
            </Text>
          </View>
          <View style={{flex: 0.33}}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.distanceDurationDeliveryLable,
                      {color: MyDarkTheme.colors.text},
                    ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DELIVERYFEE}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.distanceDurationDeliveryValue,
                        {
                          textDecorationLine: updatedPrice
                            ? 'line-through'
                            : 'none',
                          opacity: updatedPrice ? 0.5 : 1,
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(12),
                        },
                      ]
                    : [
                        styles.distanceDurationDeliveryValue,
                        {
                          textDecorationLine: updatedPrice
                            ? 'line-through'
                            : 'none',
                          opacity: updatedPrice ? 0.5 : 1,
                          fontSize: textScale(12),
                        },
                      ]
                }>
                {selectedCarOption
                  ? `${currencies?.primary_currency?.symbol}${(
                      Number(selectedCarOption?.variant[0]?.multiplier) *
                      Number(selectedCarOption?.variant[0]?.price)
                    ).toFixed(2)}`
                  : ''}
              </Text>
              {updatedPrice && (
                <Text
                  style={
                    (isDarkMode
                      ? [
                          styles.distanceDurationDeliveryValue,
                          {
                            color: MyDarkTheme.colors.text,
                            fontSize: textScale(12),
                          },
                        ]
                      : styles.distanceDurationDeliveryValue,
                    {fontSize: textScale(12)})
                  }>
                  {`${currencies?.primary_currency?.symbol}${
                    Number(selectedCarOption.tags_price) -
                      Number(updatedPrice) >
                    0
                      ? (
                          Number(selectedCarOption.tags_price) -
                          Number(updatedPrice)
                        ).toFixed(2)
                      : 0
                  }`}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 0.3, justifyContent: 'center'}}>
            <View
              style={{
                height: moderateScale(28),
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Image
                style={{height: 40, width: 100}}
                source={
                  selectedCarOption?.media.length &&
                  selectedCarOption?.media[0]?.image?.path
                    ? {
                        uri: getImageUrl(
                          selectedCarOption?.media[0]?.image?.path?.image_fit,
                          selectedCarOption?.media[0]?.image?.path?.image_path,
                          '500/500',
                        ),
                      }
                    : imagePath.user
                }
              />
            </View>
          </View>
          <View
            style={{
              flex: 0.65,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.distanceDurationDeliveryValue,
                        {color: MyDarkTheme.colors.text},
                      ]
                    : styles.distanceDurationDeliveryValue
                }>
                {selectedCarOption?.translation.length
                  ? selectedCarOption?.translation[0].title
                  : ''}
              </Text>
              <Text
                style={
                  (isDarkMode
                    ? [
                        styles.distanceDurationDeliveryLable,
                        {
                          color: MyDarkTheme.colors.text,
                          marginTop: moderateScale(5),
                        },
                      ]
                    : styles.distanceDurationDeliveryLable,
                  {
                    marginTop: moderateScale(5),
                    color: '#ACB1C0',
                  })
                }>
                {totalDuration < 60
                  ? `${totalDuration} mins`
                  : `${(totalDuration / 60).toFixed(2)} hrs`}
              </Text>
            </View>
          </View>
        </View>
        {!!loyalityAmount && (
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: moderateScale(20),
              justifyContent: 'space-between',
              marginVertical: moderateScale(16),
            }}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.distanceDurationDeliveryLable,
                      {color: MyDarkTheme.colors.text},
                    ]
                  : styles.distanceDurationDeliveryLable
              }>
              {'Loyalty'}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.distanceDurationDeliveryValue,
                      {color: MyDarkTheme.colors.text},
                    ]
                  : styles.distanceDurationDeliveryValue
              }>{`-${currencies?.primary_currency?.symbol}${(
              Number(selectedCarOption?.variant[0]?.multiplier) *
              Number(loyalityAmount)
            ).toFixed(2)}`}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => _getAllOffers(selectedCarOption, '')}
          style={styles.offersViewB}>
          {couponInfo ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{flex: 0.7, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{tintColor: themeColors.primary_color}}
                  source={imagePath.percent}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                  {`${strings.CODE} ${couponInfo?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                <Text
                  onPress={removeCoupon}
                  style={[styles.removeCoupon, {color: colors.cartItemPrice}]}>
                  {strings.REMOVE}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={imagePath.percent}
              />
              <Text
                style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                {strings.APPLY_PROMO_CODE}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View
          style={{
            marginTop: moderateScale(10),
            marginHorizontal: moderateScale(20),
            marginBottom: moderateScale(20),
          }}>
          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{textTransform: 'none', fontSize: textScale(12)}}
            onPress={_confirmAndPay}
            // marginTop={moderateScaleVertical(10)}
            // marginBottom={moderateScaleVertical(5)}
            // btnText={`${slectedDate}  -  ${selectedTime}`}
            btnText={
              pickUpTimeType === 'now'
                ? strings.BOOK_NOW
                : strings.SCHEDULE_RIDE_FOR +
                  `${moment(slectedDate).format('DD MMM')} ${selectedTime} `
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
