import React, { useState } from 'react';
import {
  I18nManager,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
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
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFun from './styles';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import moment from 'moment';
import { string } from 'prop-types';
import { androidCameraPermission } from '../../../utils/permissions';
import ImagePicker from 'react-native-image-crop-picker';

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
  redirectToPayement,
  selectedPayment = null,
  pickup_taxi = false,
  uploadImage
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
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const userData = useSelector((state) => state?.auth?.userData);
  const [image, setImage] = useState('')

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
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


  const onImageUpload = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus || Platform.OS === 'ios') {
      Alert.alert(
        'Upload Image ',
        'Choose an option',
        [
          { text: 'Camera', onPress: onCamera },
          { text: 'Gallery', onPress: onGallery },
          { text: 'Cancel', onPress: () => { } },
        ],
        { cancelable: true },
      );
    }
  };

  const onGallery = async () => {
    try {
      let image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        multiple: false,
        cropping: true,
        mediaType: 'photo',
      })
      console.log("Image path", image)
      uploadImage(image.path)
      setImage(image.path)
    } catch (error) {
      console.log(error)
    }

  }

  const onCamera = async (index) => {
    try {
      let image = await ImagePicker.openCamera({
        width: 100,
        height: 100,
        useFrontCamera: true,
        multiple: false,
        mediaType: 'photo',

      })
      console.log("Image path", image)
      uploadImage(image.path)
      setImage(image.path)
    }
    catch (error) {
      console.log('Image Picker error: ', error)
    }
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
              style={{ flex: 0.2, marginStart: moderateScale(18) }}
              onPress={onPressBack}>
              <Image
                style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
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
                  ? `${currencies?.primary_currency?.symbol}${Number(
                    selectedCarOption?.variant[0]?.price,
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
          <View style={{ flex: 0.33 }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DISTANCE}
            </Text>
            <Text
              style={[
                styles.distanceDurationDeliveryLable,
                { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
              ]}>
              {`${totalDistance} kms`}
            </Text>
          </View>
          <View style={{ flex: 0.33 }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DURATION}
            </Text>
            <Text
              style={[
                styles.distanceDurationDeliveryLable,
                { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
              ]}>
              {totalDuration < 60
                ? `${totalDuration} mins`
                : `${(totalDuration / 60).toFixed(2)} hrs`}
            </Text>
          </View>
          <View style={{ flex: 0.33 }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DELIVERYFEE}
            </Text>

            <View style={{ flexDirection: 'row' }}>
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
                  ? `${currencies?.primary_currency?.symbol}${Number(
                    selectedCarOption?.variant[0]?.price,
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
                      { fontSize: textScale(12) })
                  }>
                  {`${currencies?.primary_currency?.symbol}${Number(selectedCarOption.tags_price) -
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
          <View style={{ flex: 0.3, justifyContent: 'center' }}>
            <View
              style={{
                height: moderateScale(28),
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Image
                style={{ height: 40, width: 100 }}
                resizeMode={'contain'}
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
            <View style={{ justifyContent: 'center' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.distanceDurationDeliveryValue,
                      { color: MyDarkTheme.colors.text },
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
                    { color: MyDarkTheme.colors.text },
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
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryValue
              }>{`-${currencies?.primary_currency?.symbol}${(
                Number(selectedCarOption?.variant[0]?.multiplier) *
                Number(loyalityAmount)
              ).toFixed(2)}`}</Text>
          </View>
        )}

        {/* select payment method */}
        <TouchableOpacity
          onPress={redirectToPayement}
          style={
            isDarkMode
              ? [
                styles.paymentMainView,
                {
                  justifyContent: 'space-between',
                  backgroundColor: MyDarkTheme.colors.lightDark,
                },
              ]
              : [styles.paymentMainView, { justifyContent: 'space-between' }]
          }>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
              source={imagePath.paymentMethod}
            />
            <Text
              style={
                isDarkMode
                  ? [styles.selectedMethod, { color: MyDarkTheme.colors.text }]
                  : styles.selectedMethod
              }>
              {selectedPayment
                ? selectedPayment?.title
                : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <Image
              source={imagePath.goRight}
              style={
                isDarkMode
                  ? {
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    tintColor: MyDarkTheme.colors.text,
                  }
                  : { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }
              }
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => _getAllOffers(selectedCarOption, '')}
          style={{
            ...styles.offersViewB,
            marginHorizontal: moderateScale(17),
            // backgroundColor: 'black'
          }}>
          {couponInfo ? (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ tintColor: themeColors.primary_color }}
                  source={imagePath.percent2}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
                  {`${strings.CODE} ${couponInfo?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                <Text
                  onPress={removeCoupon}
                  style={[styles.removeCoupon, { color: colors.cartItemPrice }]}>
                  {strings.REMOVE}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',

            }}>
              <Image
                style={{ tintColor: themeColors.primary_color, }}
                source={imagePath.percent2}
              />
              <Text
                style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
                {strings.APPLY_PROMO_CODE}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...styles.offersViewB,
            marginVertical: 0,
            paddingVertical: 0,
            marginBottom: moderateScaleVertical(10),

          }}
          onPress={onImageUpload}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ tintColor: themeColors.primary_color }}
              source={imagePath.icUpload}
            />
            <Text
              style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
              {image == '' ? strings.UPLOAD_IMAGE : strings.CHANGE_IMAGE}
            </Text>
          </View>
        </TouchableOpacity>

        {image !== '' && <View
          style={{
            ...styles.offersViewB,
            marginVertical: 0,
            paddingVertical: 0,
            alignSelf: 'flex-start',
          }}
        >
          <Image
            source={{ uri: image }}
            style={{
              width: moderateScale(40),
              height: moderateScale(40),
              borderRadius: moderateScale(8)
            }}
          />
          <TouchableOpacity
            onPress={() => setImage('')}
            style={{
              position: 'absolute',
              top: -4,
              right: 0,
            }}>
            <Image
              style={{
                width: moderateScale(16),
                height: moderateScale(16),
                borderRadius: moderateScale(10)
              }}
              resizeMode="contain"
              source={imagePath.icClose3}
            />
          </TouchableOpacity>
        </View>}

        <View
          style={{
            marginTop: moderateScale(10),
            marginHorizontal: moderateScale(20),
            marginBottom: moderateScale(20),
          }}>
          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{ textTransform: 'none', fontSize: textScale(12) }}
            onPress={_confirmAndPay}
            // marginTop={moderateScaleVertical(10)}
            // marginBottom={moderateScaleVertical(5)}
            // btnText={`${slectedDate}  -  ${selectedTime}`}
            btnText={
              pickup_taxi ?
                strings.BOOK_NOW_RIDE
                :
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
